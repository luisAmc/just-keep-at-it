import { ExerciseType } from '@prisma/client';

const DEFAULT_AEROBIC_SET = { mins: '', distance: '', kcal: '' };
const DEFAULT_STRENGTH_SET = { reps: '', lbs: '' };

export function getDefaultExerciseSet(type: string) {
    if (type === ExerciseType.AEROBIC) {
        return DEFAULT_AEROBIC_SET;
    }

    return DEFAULT_STRENGTH_SET;
}
