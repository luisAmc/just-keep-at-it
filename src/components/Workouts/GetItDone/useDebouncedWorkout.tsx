import { useEffect, useState } from 'react';

export function useDebouncedWorkout<T>(workoutString: T, delay = 3000) {
    const [debouncedWorkout, setdebouncedWorkout] = useState(workoutString);

    useEffect(() => {
        const handler = setTimeout(() => {
            setdebouncedWorkout(workoutString);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [workoutString]);

    return debouncedWorkout;
}
