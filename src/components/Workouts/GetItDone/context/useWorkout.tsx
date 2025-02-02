import { ExerciseType } from '@prisma/client';
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from 'react';
import {
    FieldValues,
    useFieldArray,
    UseFieldArrayReturn,
    useFormContext,
} from 'react-hook-form';
import { useExercises } from '~/contexts/useExercises';
import { RouterOutputs } from '~/utils/api';
import { getDefaultExerciseSet } from '~/utils/constants';

type WorkoutType = RouterOutputs['workout']['byId'];
export type MoveAction = 'up' | 'down' | 'first' | 'last';

interface WorkoutContextType {
    workoutId: string;
    name: string;
    setName: (newName: string) => void;

    // Workout exercises
    workoutExercisesFieldArray: UseFieldArrayReturn<
        FieldValues,
        'workoutExercises',
        'id'
    >;
    workoutExercises: Array<WorkoutType['workoutExercises'][number]>;
    workoutExerciseCount: number;
    addExercise: (exerciseId: string) => void;

    onChange: (index: number, newExerciseId: string) => void;
    onRemove: (index: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    workout: WorkoutType;
    children: ReactNode;
}

export function WorkoutProvider({ workout, children }: WorkoutProviderProps) {
    const [name, _setName] = useState(workout.name);
    const { getExerciseById } = useExercises();

    const setName = useCallback((newName: string) => _setName(newName), []);

    const form = useFormContext();
    const workoutExercisesFieldArray = useFieldArray({
        control: form.control,
        name: 'workoutExercises',
    });

    function addExercise(exerciseId: string) {
        const exercise = getExerciseById(exerciseId)!;

        const defaultSet = getDefaultExerciseSet(exercise.type);
        const lastSetCount = exercise.lastSession?.sets.length ?? 1;

        const sets =
            exercise.type === ExerciseType.AEROBIC
                ? [defaultSet]
                : Array.from({ length: lastSetCount }).fill(defaultSet);

        workoutExercisesFieldArray.append({
            exerciseId: exerciseId,
            sets: sets,
            notes: '',
        });
    }

    function onChange(index: number, newExerciseId: string) {
        // Using setValue instead of formField.update to prevent rerender.
        //
        // This means that we need another way to update the name and sets information
        // in the ExerciseCard, so we store in the state of `WorkoutExerciseProvider`
        // the exerciseId to change it there.
        form.setValue(`workoutExercises.${index}.exerciseId`, newExerciseId);
    }

    function onRemove(index: number) {
        workoutExercisesFieldArray.remove(index);
    }

    return (
        <WorkoutContext.Provider
            value={{
                workoutId: workout.id,
                name,
                setName,

                workoutExercisesFieldArray,
                workoutExercises: workout.workoutExercises,
                workoutExerciseCount: workoutExercisesFieldArray.fields.length,
                addExercise,

                onChange,
                onRemove,
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
            '`useWorkout` can only be use inside a GetItDone component.',
        );
    }

    return context;
}
