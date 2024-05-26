import { ExerciseType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';

interface Params {
    data?: RouterOutputs['workout']['byId'];
    form: UseFormReturn<any>;
}

export function usePartiallySaveWorkout({ data, form }: Params) {
    const [isSetupDone, setIsSetupDone] = useState(false);

    const { getExerciseById } = useExercises();

    useEffect(() => {
        if (!data) {
            return;
        }

        const sortedWorkoutExercises = data.workoutExercises.sort(
            (a, b) => a.exerciseIndex - b.exerciseIndex,
        );

        const workoutExercises = [];

        for (const workoutExercise of sortedWorkoutExercises) {
            const sets = workoutExercise.sets.map((set) => ({
                mins: set.mins ?? 0,
                distance: set.distance ?? 0,
                kcal: set.kcal ?? 0,
                reps: set.reps ?? 0,
                lbs: set.lbs ?? 0,
            }));

            const exercise = getExerciseById(workoutExercise.exercise.id);
            const hasLastSession = exercise?.lastSession;

            if (hasLastSession) {
                const lastSessionHadMoreSets =
                    exercise.lastSession.sets.length > sets.length;

                const isStregthExercise =
                    exercise.type === ExerciseType.STRENGTH;

                if (lastSessionHadMoreSets && isStregthExercise) {
                    const differenceInSetsCount =
                        exercise.lastSession.sets.length - sets.length;

                    const blankSets = Array.from({
                        length: differenceInSetsCount,
                    }).map((_) => ({
                        mins: 0,
                        distance: 0,
                        kcal: 0,
                        reps: 0,
                        lbs: 0,
                    }));

                    sets.push(...blankSets);
                }
            }

            workoutExercises.push({
                exerciseId: workoutExercise.exercise.id,
                notes: workoutExercise.notes ?? '',
                sets: sets,
            });
        }

        form.reset({ workoutExercises: workoutExercises });

        setIsSetupDone(true);
    }, [data]);

    return [isSetupDone];
}
