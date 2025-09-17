import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { Form, useZodForm } from '~/components/shared/Form';
import { useDebouncedWorkout } from './useDebouncedWorkout';
import { useEffect, useState } from 'react';
import { usePartiallySaveWorkout } from './usePartiallySaveWorkout';
import { useRouter } from 'next/router';
import { useWatch } from 'react-hook-form';
import { WorkoutExercises } from './workout/WorkoutExercises';
import { WorkoutHeader } from './workout/WorkoutHeader';
import { WorkoutProvider } from './context/useWorkout';
import { z } from 'zod';
import { toast } from 'sonner';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { CheckIcon, PandaIcon } from 'lucide-react';
import {
    LocalDataType,
    usePersistedLocalStorage,
} from '~/utils/usePersistedLocalStorage';
import { numberShape } from '~/utils/shapes';
import { Drawer, useDrawer } from '~/components/shared/Drawer';

export const getItDoneSchema = z.object({
    workoutExercises: z.array(
        z.object({
            exerciseId: z.string(),
            sets: z.array(
                z.object({
                    mins: numberShape.optional(),
                    distance: numberShape.optional(),
                    kcal: numberShape.optional(),
                    reps: numberShape.optional(),
                    lbs: numberShape.optional(),
                }),
            ),
            notes: z.string().trim().optional(),
        }),
    ),
});

export function GetItDone() {
    const router = useRouter();

    const finishDrawer = useDrawer();

    const queryClient = api.useUtils();
    const persistedLocalStorage = usePersistedLocalStorage();

    const { data, isLoading } = api.workout.byId.useQuery(
        { workoutId: router.query.workoutId as string },
        { refetchOnWindowFocus: false },
    );

    const getItDone = api.workout.getItDone.useMutation({
        onSuccess(data) {
            persistedLocalStorage.remove(data.id);

            queryClient.workout.infinite.invalidate();
            queryClient.exercise.allByCategory.invalidate();

            router.replace(`/workouts/${data.id}`);
        },
    });

    const form = useZodForm({ schema: getItDoneSchema });

    const [isSetupDone] = usePartiallySaveWorkout({ data, form });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const workoutState = useWatch({ control: form.control });

    const debouncedWorkoutState = useDebouncedWorkout(workoutState, 100);

    useEffect(() => {
        if (!data || !isSetupDone) {
            return;
        }
        const values = debouncedWorkoutState as z.infer<typeof getItDoneSchema>;

        const input: LocalDataType = {
            id: data.id,
            updatedAt: Date.now(),
            workoutExercises: values.workoutExercises.map((we, i) => ({
                exerciseIndex: i,
                exerciseId: we.exerciseId,
                notes: we.notes,
                sets: (we.sets as any[]).map((set) => ({
                    mins: Number(set.mins) ?? 0,
                    distance: Number(set.distance) ?? 0,
                    kcal: Number(set.kcal) ?? 0,
                    reps: Number(set.reps) ?? 0,
                    lbs: Number(set.lbs) ?? 0,
                })),
            })),
        };

        if (!isSubmitted) {
            persistedLocalStorage.save(data.id, input);
        }
    }, [debouncedWorkoutState]);

    async function handleSubmit() {
        setIsSubmitted(true);

        const values: z.infer<typeof getItDoneSchema> = form.getValues();

        const nonEmptyWorkoutExercises = values.workoutExercises.filter(
            (workoutExercise) => {
                const setsCount = workoutExercise.sets.length;

                if (setsCount > 0) {
                    return true;
                }

                return false;
            },
        );

        const workoutExercises = nonEmptyWorkoutExercises
            .map((workoutExercise, idx) => {
                const nonEmptySets = workoutExercise.sets.filter((set) => {
                    const fullAerobicFields =
                        Number(set.mins ?? 0) !== 0 &&
                        Number(set.distance ?? 0) !== 0 &&
                        Number(set.kcal ?? 0) !== 0;

                    const fullStrengthFields =
                        Number(set.lbs ?? 0) !== 0 &&
                        Number(set.reps ?? 0) !== 0;

                    if (fullAerobicFields || fullStrengthFields) {
                        return true;
                    }

                    return false;
                });

                return {
                    exerciseIndex: idx,
                    exerciseId: workoutExercise.exerciseId,
                    notes: workoutExercise.notes,
                    sets: nonEmptySets.map((set) => ({
                        mins: Number(set.mins ?? 0),
                        distance: Number(set.distance ?? 0),
                        kcal: Number(set.kcal ?? 0),
                        reps: Number(set.reps ?? 0),
                        lbs: Number(set.lbs ?? 0),
                    })),
                };
            })
            .filter((workoutExercise) => workoutExercise.sets.length > 0);

        const input = {
            workoutId: data!.id,
            workoutExercises,
        };

        toast.promise(getItDone.mutateAsync(input), {
            loading: 'Finalizando rútina...',
            success: '¡Rútina finalizada!',
            error: 'No se pudo completar la rútina.',
        });
    }

    return (
        <div className="flex flex-col gap-x-4 pb-8">
            <ErrorMessage
                title="No completar la rútina"
                error={getItDone.error?.message}
            />

            {!isLoading && isSetupDone && data && (
                <Form form={form} onSubmit={() => {}} className="gap-y-2">
                    <WorkoutProvider workout={data}>
                        <WorkoutHeader />

                        <div className="flex flex-col gap-y-4 px-1">
                            <WorkoutExercises />

                            <Button
                                onClick={finishDrawer.open}
                                disabled={!form.formState.isValid}
                            >
                                <CheckIcon className="mr-1 size-4" />
                                <span>Finalizar</span>
                            </Button>

                            <Drawer {...finishDrawer.props}>
                                <div className="flex flex-col items-center gap-y-2">
                                    <PandaIcon className="text-brand-700 size-20" />

                                    <p className="text-center">
                                        ¿Finalizar esta rútina?
                                    </p>
                                </div>

                                <Button onClick={handleSubmit}>
                                    <CheckIcon className="mr-1 size-4" />
                                    <span>Sí, quiero finalizarla</span>
                                </Button>
                            </Drawer>
                        </div>
                    </WorkoutProvider>
                </Form>
            )}
        </div>
    );
}
