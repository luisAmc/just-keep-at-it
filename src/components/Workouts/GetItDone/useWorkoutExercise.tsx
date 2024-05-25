import { type ReactNode, createContext, useContext, useMemo } from 'react';
import { ExerciseType, useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';

export type MoveExerciseActionOption = 'up' | 'down' | 'first' | 'last';

interface WorkoutExerciseActions {
    onChange(): void;
    onRemove(): void;
    onMove(moveAction: MoveExerciseActionOption): void;
    // onSelect(): void;
}

interface WorkoutExerciseContextType extends WorkoutExerciseActions {
    exerciseId: string;
    name: string;
    type: string;
    categoryName: string;
    lastSession: ExerciseType['lastSession'] | undefined;
    // sets: RouterOutputs['workout']['byId']['workoutExercises'][number]['sets'];

    formName: string;
    isFirst: boolean;
    isLast: boolean;
}

const WorkoutExerciseContext = createContext<
    WorkoutExerciseContextType | undefined
>(undefined);

interface WorkoutExerciseProviderProps extends WorkoutExerciseActions {
    // workoutExercise: RouterOutputs['workout']['byId']['workoutExercises'][number];
    exerciseId: string;
    formName: string;
    children: ReactNode;
    isFirst: boolean;
    isLast: boolean;
}

export function WorkoutExerciseProvider({
    // workoutExercise,
    exerciseId,
    formName,
    isFirst,
    isLast,
    children,
    onChange,
    onRemove,
    onMove,
}: WorkoutExerciseProviderProps) {
    const { getExerciseById } = useExercises();

    const exercise = getExerciseById(exerciseId)!;
    // const context = useMemo((): WorkoutExerciseContextType => {

    //     return {};
    // }, [exerciseId]);

    return (
        <WorkoutExerciseContext.Provider
            value={{
                exerciseId: exercise.id,
                name: exercise.name,
                type: exercise.type,
                categoryName: exercise.categoryName,
                lastSession: exercise.lastSession,
                // sets: workoutExercise.sets,
                isFirst,
                isLast,
                formName,
                onChange,
                onRemove,
                onMove,
            }}
        >
            {children}
        </WorkoutExerciseContext.Provider>
    );
}

export function useWorkoutExercise() {
    const context = useContext(WorkoutExerciseContext);

    if (!context) {
        throw new Error(
            '`useWorkoutExercise` can only be used in a WorkoutExercises component.',
        );
    }

    return context;
}
