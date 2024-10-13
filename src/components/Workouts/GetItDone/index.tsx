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
import { WorkoutExercisesList } from './WorkoutExerciseList';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutProvider } from './useWorkout';
import { z } from 'zod';
import toast from 'react-hot-toast';

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

    const { data, isFetching } = api.workout.byId.useQuery(
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

    const [isSetupDone] = usePartiallySaveWorkout({ form, data });

    const workoutState = useWatch({ control: form.control });

    const debouncedWorkoutState = useDebouncedWorkout(workoutState, 300);

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
                        mins: Number(set.mins),
                        distance: Number(set.distance),
                        kcal: Number(set.kcal),
                        reps: Number(set.reps),
                        lbs: Number(set.lbs),
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
                        mins: Number(set.mins),
                        distance: Number(set.distance),
                        kcal: Number(set.kcal),
                        reps: Number(set.reps),
                        lbs: Number(set.lbs),
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
        <div className="flex flex-col gap-y-4">
            {isFetching && <Shimmer />}

            {!isFetching && data && isSetupDone && (
                <WorkoutProvider workout={data}>
                    <div className="space-y-4 rounded-xl bg-brand-50 px-2 pb-8 pt-4">
                        <WorkoutHeader />

                        <Form form={form} onSubmit={() => {}}>
                            <WorkoutExercisesList />

                            <Button
                                disabled={
                                    !form.formState.isValid ||
                                    partialSave.isLoading
                                }
                                onClick={handleSubmit}
                                className="w-full"
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
                        </Form>
                    </div>
                </WorkoutProvider>
            )}
        </div>
    );
}
