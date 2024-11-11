export function usePersistedLocalStorage() {
    function save(workoutId: string, workoutData: unknown) {
        localStorage.setItem(workoutId, JSON.stringify(workoutData));
    }

    function get(workoutId: string) {
        const item = localStorage.getItem(workoutId);
        return JSON.parse(item || '{}') as LocalDataType;
    }

    function remove(workoutId: string) {
        localStorage.removeItem(workoutId);
    }

    return { save, get, remove };
}

export type LocalDataType = {
    id: string;
    updatedAt: number;
    workoutExercises: {
        exerciseIndex: number;
        exerciseId: string;
        notes: string | undefined;
        sets: {
            mins: number;
            distance: number;
            kcal: number;
            reps: number;
            lbs: number;
        }[];
    }[];
};
