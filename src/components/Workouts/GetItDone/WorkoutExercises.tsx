import { useWorkout } from './useWorkout';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorkoutExercise } from './WorkoutExercise';
import {
    MoveExerciseActionOption,
    WorkoutExerciseProvider,
} from './useWorkoutExercise';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const FIELD_ARRAY_NAME = 'workoutExercises';

const spring = {
    type: 'spring',
    damping: 20,
    stiffness: 250,
};

export function WorkoutExercises() {
    const form = useFormContext();

    const workoutExercisesFieldArray = useFieldArray({
        control: form.control,
        name: FIELD_ARRAY_NAME,
    });

    const { workoutExercises } = useWorkout();

    useEffect(() => {
        form.reset({
            workoutExercises: workoutExercises
                .sort((a, b) => a.exerciseIndex - b.exerciseIndex)
                .map((workoutExercise) => ({
                    exerciseId: workoutExercise.exercise.id,
                    sets: workoutExercise.sets.map((set) => ({
                        mins: set.mins.toString() ?? '',
                        distance: set.distance.toString() ?? '',
                        kcal: set.kcal.toString() ?? '',
                        reps: set.reps.toString() ?? '',
                        lbs: set.lbs.toString() ?? '',
                    })),
                })),
        });
    }, []);

    const maxIndex = workoutExercisesFieldArray.fields.length - 1;

    function handleChange(index: number) {}

    function handleRemove(index: number) {
        workoutExercisesFieldArray.remove(index);
    }

    function handleMove(action: MoveExerciseActionOption, index: number) {
        if (action === 'first') {
            workoutExercisesFieldArray.move(index, 0);
        } else if (action === 'last') {
            workoutExercisesFieldArray.move(index, maxIndex);
        } else {
            const moveStep = action === 'up' ? -1 : 1;
            workoutExercisesFieldArray.move(index, index + moveStep);
        }
    }

    return (
        <div className="space-y-2">
            {workoutExercisesFieldArray.fields.map((workoutExercise, idx) => (
                <motion.div
                    key={workoutExercise.id}
                    layout={'position'}
                    transition={spring}
                >
                    <WorkoutExerciseProvider
                        exerciseId={(workoutExercise as any).exerciseId}
                        formName={`${FIELD_ARRAY_NAME}.${idx}`}
                        isFirst={idx === 0}
                        isLast={idx === maxIndex}
                        onChange={() => handleChange(idx)}
                        onRemove={() => handleRemove(idx)}
                        onMove={(moveAction) => handleMove(moveAction, idx)}
                    >
                        <WorkoutExercise />
                    </WorkoutExerciseProvider>
                </motion.div>
            ))}
        </div>
    );
}
