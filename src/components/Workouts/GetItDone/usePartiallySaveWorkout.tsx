import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';
import { getDefaultExerciseSet } from '~/utils/constants';
import { usePersistedLocalStorage } from '~/utils/usePersistedLocalStorage';
import { v4 as uuidV4 } from 'uuid';

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
                mins: String(set.mins),
                distance: String(set.distance),
                kcal: String(set.kcal),
                reps: String(set.reps),
                lbs: String(set.lbs),
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
                uid: uuidV4(),
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
