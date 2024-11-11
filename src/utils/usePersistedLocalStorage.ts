export function usePersistedLocalStorage() {
    function save(workoutId: string, workoutData: unknown) {
        localStorage.setItem(workoutId, JSON.stringify(workoutData));
    }

    function get<T>(workoutId: string) {
        const item = localStorage.getItem(workoutId);
        return JSON.parse(item || '{}') as T | undefined;
    }

    function remove(workoutId: string) {
        localStorage.removeItem(workoutId);
    }

    return { save, get, remove };
}
