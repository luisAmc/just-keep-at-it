import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';
import { getDefaultExerciseSet } from '~/utils/constants';
import { usePersistedLocalStorage } from '~/utils/usePersistedLocalStorage';

type RemoveDataType = Pick<
    RouterOutputs['workout']['byId'],
    'id' | 'workoutExercises' | 'updatedAt'
>;

interface Params {
    data?: RemoveDataType;
    form: UseFormReturn<any>;
}

export function usePartiallySaveWorkout({ data, form }: Params) {
    const persistedLocalStorage = usePersistedLocalStorage();

    const [isSetupDone, setIsSetupDone] = useState(false);

    const { getExerciseById } = useExercises();

    useEffect(() => {
        if (!data || isSetupDone) {
            return;
        }

        const localData = persistedLocalStorage.get(data.id);

        const isLocalMostRecent =
            localData && localData.updatedAt > data.updatedAt.valueOf();

        const mostRecentData = isLocalMostRecent ? localData : data;

        const sortedWorkoutExercises = mostRecentData.workoutExercises.sort(
            (a, b) => a.exerciseIndex - b.exerciseIndex,
        );

        const workoutExercises = [];

        for (const workoutExercise of sortedWorkoutExercises) {
            const sets = workoutExercise.sets.map((set) => ({
                mins: (set.mins ?? 0).toString(),
                distance: (set.distance ?? 0).toString(),
                kcal: (set.kcal ?? 0).toString(),
                reps: (set.reps ?? 0).toString(),
                lbs: (set.lbs ?? 0).toString(),
            }));

            const exerciseId =
                'exerciseId' in workoutExercise
                    ? workoutExercise.exerciseId
                    : workoutExercise.exercise.id;

            const exercise = getExerciseById(exerciseId);
            const hasLastSession = exercise?.lastSession;

            if (hasLastSession) {
                const lastSessionHadMoreSets =
                    exercise.lastSession.sets.length > sets.length;

                if (lastSessionHadMoreSets) {
                    const differenceInSetsCount =
                        exercise.lastSession.sets.length - sets.length;

                    const defaultSet = getDefaultExerciseSet(exercise.type);

                    const blankSets = Array.from({
                        length: differenceInSetsCount,
                    }).fill(defaultSet);

                    sets.push(...(blankSets as any));
                }
            }

            workoutExercises.push({
                exerciseId: exerciseId,
                notes: workoutExercise.notes ?? '',
                sets: sets,
            });
        }

        form.reset({ workoutExercises: workoutExercises });

        setIsSetupDone(true);
    }, [data]);

    return [isSetupDone];
}
