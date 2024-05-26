import { api } from '~/utils/api';
import { Form, useZodForm } from '~/components/shared/Form';
import { Page } from '~/components/shared/Page';
import { useRouter } from 'next/router';
import { WorkoutExercisesList } from './WorkoutExerciseList';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutProvider } from './useWorkout';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useDebouncedWorkout } from './useDebouncedWorkout';
import toast from 'react-hot-toast';
import { Shimmer } from './Shimmer';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '~/components/shared/Button';

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

    const [isSetupDone, setIsSetupDone] = useState(false);

    useEffect(() => {
        if (!data) {
            return;
        }

        form.reset({
            workoutExercises: data.workoutExercises
                .sort((a, b) => a.exerciseIndex - b.exerciseIndex)
                .map((workoutExercise) => ({
                    exerciseId: workoutExercise.exercise.id,
                    notes: workoutExercise.notes ?? '',
                    sets: workoutExercise.sets.map((set, idx) => ({
                        mins: set.mins ?? 0,
                        distance: set.distance ?? 0,
                        kcal: set.kcal ?? 0,
                        reps: set.reps ?? 0,
                        lbs: set.lbs ?? 0,
                    })),
                })),
        });

        setIsSetupDone(true);
    }, [data]);

    const workoutState = useWatch({ control: form.control });
    const debouncedWorkoutState = useDebouncedWorkout(workoutState, 300);

    useEffect(() => {
        if (data && isSetupDone) {
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

        const workoutExercises = nonEmptyWorkoutExercises.map(
            (workoutExercise, idx) => {
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
            },
        );

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
            {isLoading && <Shimmer />}

            {data && (
                <WorkoutProvider workout={data}>
                    <div className="space-y-4 rounded-xl bg-brand-50 px-2 py-4">
                        <WorkoutHeader />

                        <Form form={form} onSubmit={() => {}}>
                            <WorkoutExercisesList />

                            <Button
                                disabled={!form.formState.isValid}
                                onClick={handleSubmit}
                                className="w-full"
                            >
                                <CheckIcon className="mr-1 size-4" />
                                <span>Finalizar</span>
                            </Button>
                        </Form>
                    </div>
                </WorkoutProvider>
            )}
        </div>
    );
}
