import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { Form, useZodForm } from '~/components/shared/Form';
import { useDebouncedWorkout } from './useDebouncedWorkout';
import { useEffect } from 'react';
import {
    LocalDataType,
    usePartiallySaveWorkout,
} from './usePartiallySaveWorkout';
import { useRouter } from 'next/router';
import { useWatch } from 'react-hook-form';
import { WorkoutExercises } from './workout/WorkoutExercises';
import { WorkoutHeader } from './workout/WorkoutHeader';
import { WorkoutProvider } from './context/useWorkout';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { CheckIcon } from 'lucide-react';
import { usePersistedLocalStorage } from '~/utils/usePersistedLocalStorage';
import { Shimmer } from './Shimmer';

export const getItDoneSchema = z.object({
    workoutExercises: z.array(
        z.object({
            exerciseId: z.string(),
            sets: z.array(
                z.object({
                    mins: z.coerce.number().optional(),
                    distance: z.coerce.number().optional(),
                    kcal: z.coerce.number().optional(),
                    reps: z.coerce.number().optional(),
                    lbs: z.coerce.number().optional(),
                }),
            ),
            notes: z.string().trim().optional(),
        }),
    ),
});

export function GetItDone() {
    const router = useRouter();

    const queryClient = api.useUtils();

    const { data, isLoading } = api.workout.byId.useQuery(
        { workoutId: router.query.workoutId as string },
        { refetchOnWindowFocus: false },
    );

    const getItDone = api.workout.getItDone.useMutation({
        onSuccess(data) {
            queryClient.workout.infinite.invalidate();
            queryClient.exercise.allByCategory.invalidate();

            router.replace(`/workouts/${data.id}`);
        },
    });

    const persistedLocalStorage = usePersistedLocalStorage();
    const form = useZodForm({ schema: getItDoneSchema });

    const [isSetupDone] = usePartiallySaveWorkout({ data, form });

    const workoutState = useWatch({ control: form.control });

    const debouncedWorkoutState = useDebouncedWorkout(workoutState, 500);

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
                    mins: Number(set.mins ?? 0),
                    distance: Number(set.distance ?? 0),
                    kcal: Number(set.kcal ?? 0),
                    reps: Number(set.reps ?? 0),
                    lbs: Number(set.lbs ?? 0),
                })),
            })),
        };

        persistedLocalStorage.save(data.id, input);
    }, [debouncedWorkoutState]);

    async function handleSubmit() {
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
                        set.mins && set.distance && set.kcal;
                    const fullStrengthFields = set.lbs && set.reps;

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
            loading: 'Completando rútina...',
            success: '¡Rútina completada!',
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
                <Form form={form} onSubmit={() => {}}>
                    <WorkoutProvider workout={data}>
                        <WorkoutHeader />

                        <div className="flex flex-col gap-y-4 px-2">
                            <WorkoutExercises />

                            <Button
                                disabled={!form.formState.isValid}
                                className="h-12"
                                onClick={handleSubmit}
                            >
                                <CheckIcon className="mr-1 size-4" />
                                <span>Finalizar</span>
                            </Button>
                        </div>
                    </WorkoutProvider>
                </Form>
            )}
        </div>
    );
}
