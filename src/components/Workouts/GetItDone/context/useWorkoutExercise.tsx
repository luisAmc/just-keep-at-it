import { createContext, type ReactNode, useContext, useState } from 'react';
import {
    FieldValues,
    useFieldArray,
    UseFieldArrayReturn,
    useFormContext,
} from 'react-hook-form';
import { ExerciseType, useExercises } from '~/contexts/useExercises';
import { useDisclosure } from './useDisclosure';
import { useWorkout } from './useWorkout';
import { useExerciseHistoryDrawer } from '../workout/WorkoutExercises/ExerciseHistoryDrawer';
import { getDefaultExerciseSet } from '~/utils/constants';
import { ExerciseType as PrismaExerciseType } from '@prisma/client';

interface WorkoutExerciseType {
    index: number;
    exerciseId: string;
}

export interface WorkoutExerciseContextType extends WorkoutExerciseType {
    name: string;
    type: string;
    categoryName: string;
    fieldName: string;
    lastSession?: ExerciseType['lastSession'];
    setsFieldArray: UseFieldArrayReturn<FieldValues, `${string}.sets`, 'id'>;
    setCount: number;
    label: string;
    onHistory: () => void;

    changeExercise: (newExerciseId: string) => void;

    // Disclosure open/close
    isOpen: boolean;
    toggleOpen: () => void;
    openNext: () => void;

    // Exercise position in list
    isFirst: boolean;
    isLast: boolean;
}

const WorkoutExerciseContext = createContext<
    WorkoutExerciseContextType | undefined
>(undefined);

interface WorkoutExerciseProviderProps {
    workoutExercise: WorkoutExerciseType;
    onHistory: ReturnType<typeof useExerciseHistoryDrawer>['open'];
    children: ReactNode;
}

export function WorkoutExerciseProvider({
    workoutExercise,
    onHistory,
    children,
}: WorkoutExerciseProviderProps) {
    const fieldName = `workoutExercises.${workoutExercise.index}`;

    const { workoutExerciseCount, onChange } = useWorkout();
    const { isOpen, toggle, openNext } = useDisclosure();

    const { getExerciseById } = useExercises();

    // We need this to update the exercise name and sets after chaging the
    // exercise with the `change` action (changeExercise).
    //
    // We can't do it with a formField.update in `WorkoutProvider` because it
    // forces a rerender leading to clunky animations.
    const [exerciseId, setExerciseId] = useState(workoutExercise.exerciseId);

    const exercise = getExerciseById(exerciseId)!;

    const form = useFormContext();
    const setsFieldArray = useFieldArray({
        control: form.control,
        name: `${fieldName}.sets`,
    });

    const setCount = setsFieldArray.fields.length;

    const index = workoutExercise.index;
    const label = String(index + 1).padStart(2, '0');

    function changeExercise(newExerciseId: string) {
        const newExercise = getExerciseById(newExerciseId)!;

        onChange(index, newExerciseId);
        setExerciseId(newExerciseId);

        const defaultSet = getDefaultExerciseSet(newExercise.type);

        const lastSetCount = newExercise.lastSession?.sets.length ?? 1;

        const sets =
            newExercise.type === PrismaExerciseType.AEROBIC
                ? [defaultSet]
                : Array.from({ length: lastSetCount }).fill(defaultSet);

        setsFieldArray.replace(sets);
    }

    return (
        <WorkoutExerciseContext.Provider
            value={{
                ...exercise,
                exerciseId,
                index,
                label,
                fieldName,
                setsFieldArray,
                setCount,
                onHistory: () => onHistory(exerciseId),

                changeExercise,

                isOpen: isOpen(index),
                toggleOpen: () => toggle(index),
                openNext: () => openNext(index),

                isFirst: index === 0,
                isLast: index === workoutExerciseCount - 1,
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
