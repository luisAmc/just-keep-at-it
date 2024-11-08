import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Form, useZodForm } from '~/components/shared/Form';
import { Shimmer } from './Shimmer';
import { useDebouncedWorkout } from './useDebouncedWorkout';
import { useEffect } from 'react';
import { usePartiallySaveWorkout } from './usePartiallySaveWorkout';
import { useRouter } from 'next/router';
import { useWatch } from 'react-hook-form';
import { WorkoutExercises } from './workout/WorkoutExercises';
import { WorkoutHeader } from './workout/WorkoutHeader';
import { WorkoutProvider } from './context/useWorkout';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ErrorMessage } from '~/components/shared/ErrorMessage';

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

    const partialSave = api.workout.partialSave.useMutation();

    const getItDone = api.workout.getItDone.useMutation({
        onSuccess(data) {
            queryClient.workout.infinite.invalidate();
            queryClient.exercise.allByCategory.invalidate();

            router.replace(`/workouts/${data.id}`);
        },
    });

    const form = useZodForm({ schema: getItDoneSchema });

    const [isSetupDone] = usePartiallySaveWorkout({ data, form });

    const workoutState = useWatch({ control: form.control });

    const debouncedWorkoutState = useDebouncedWorkout(workoutState, 1000);

    useEffect(() => {
        const isNotGettingItDone = !getItDone.isLoading || !getItDone.isSuccess;

        if (
            data &&
            isSetupDone &&
            !partialSave.isLoading &&
            isNotGettingItDone
        ) {
            const values: z.infer<typeof getItDoneSchema> = form.getValues();

            const input = {
                workoutId: data.id,
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

            partialSave.mutateAsync(input);
        }
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
                title="No se pudo guardar los cambios"
                error={partialSave.error?.message}
            />

            <ErrorMessage
                title="No completar la rútina"
                error={getItDone.error?.message}
            />

            {isLoading && <Shimmer />}

            {!isLoading && data && (
                <Form form={form} onSubmit={() => {}}>
                    <WorkoutProvider workout={data}>
                        <WorkoutHeader />

                        <div className="flex flex-col gap-y-4 px-2">
                            <WorkoutExercises />

                            <Button
                                disabled={
                                    !form.formState.isValid ||
                                    partialSave.isLoading
                                }
                                className="h-12"
                                onClick={handleSubmit}
                            >
                                {partialSave.isLoading ? (
                                    <span>Guardando los cambios...</span>
                                ) : (
                                    <>
                                        <CheckIcon className="mr-1 size-4" />
                                        <span>Finalizar</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </WorkoutProvider>
                </Form>
            )}
        </div>
    );
}
