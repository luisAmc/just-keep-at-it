import { ExerciseType } from '@prisma/client';

const DEFAULT_AEROBIC_SET = { mins: '0', distance: '0', kcal: '0' };
const DEFAULT_STRENGTH_SET = { reps: '0', lbs: '0' };

export function getDefaultExerciseSet(type: string) {
    if (type === ExerciseType.AEROBIC) {
        return DEFAULT_AEROBIC_SET;
    }

    return DEFAULT_STRENGTH_SET;
}
