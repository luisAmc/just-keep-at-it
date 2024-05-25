import { type ReactNode, createContext, useContext, useState } from 'react';
import { RouterOutputs } from '~/utils/api';

type WorkoutType = RouterOutputs['workout']['byId'];

interface WorkoutContextType {
    workoutId: string;
    name: string;
    setName(updatedName: string): void;
    workoutExercises: Array<WorkoutType['workoutExercises'][number]>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    workout: WorkoutType;
    children: ReactNode;
}

export function WorkoutProvider({ workout, children }: WorkoutProviderProps) {
    const [name, setName] = useState(workout.name);

    return (
        <WorkoutContext.Provider
            value={{
                workoutId: workout.id,
                name,
                setName,
                workoutExercises: workout.workoutExercises,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    const context = useContext(WorkoutContext);

    if (!context) {
        throw new Error(
            '`useWorkout` can only be used in a GetItDone component.',
        );
    }

    return context;
}
