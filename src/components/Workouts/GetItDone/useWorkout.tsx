import {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useMemo,
} from 'react';
import { ExerciseType, useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';

type WorkoutType = RouterOutputs['workout']['byId'];

interface WorkoutContextType {
    workoutId: string;
    name: string;
    setName(updatedName: string): void;
    workoutExercises: Array<WorkoutType['workoutExercises'][number]>;
    addExercise(exerciseId: string): ExerciseType | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    workout: WorkoutType;
    children: ReactNode;
}

export function WorkoutProvider({ workout, children }: WorkoutProviderProps) {
    const [name, setName] = useState(workout.name);
    const { getExerciseById } = useExercises();

    const context = useMemo((): WorkoutContextType => {
        const addExercise = (exerciseId: string) => {
            return getExerciseById(exerciseId);
        };

        return {
            workoutId: workout.id,
            name,
            setName,
            workoutExercises: workout.workoutExercises,
            addExercise,
        };
    }, [workout]);

    return (
        <WorkoutContext.Provider value={context}>
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
