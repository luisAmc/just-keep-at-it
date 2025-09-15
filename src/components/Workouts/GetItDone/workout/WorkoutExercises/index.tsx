import { AddExerciseDrawer } from './AddExerciseDrawer';
import { DisclosureProvider } from '../../context/useDisclosure';
import { ExerciseCard } from './ExerciseCard';
import {
    ExerciseHistoryDrawer,
    useExerciseHistoryDrawer,
} from './ExerciseHistoryDrawer';
import { motion } from 'framer-motion';
import { useWorkout } from '../../context/useWorkout';
import { WorkoutExerciseProvider } from '../../context/useWorkoutExercise';

export function WorkoutExercises() {
    const { workoutExercisesFieldArray } = useWorkout();
    const historyDrawer = useExerciseHistoryDrawer();

    return (
        <DisclosureProvider
            initialCount={workoutExercisesFieldArray.fields.length}
        >
            <div className="flex flex-col gap-y-1">
                {workoutExercisesFieldArray.fields.map(
                    (workoutExerciseField, idx) => {
                        const workoutExercise = {
                            index: idx,
                            exerciseId: (workoutExerciseField as any)
                                .exerciseId,
                        };

                        return (
                            <motion.div
                                key={workoutExerciseField.id}
                                layout={'preserve-aspect'}
                                // layoutId={workoutExerciseField.id}
                            >
                                <WorkoutExerciseProvider
                                    workoutExercise={workoutExercise}
                                    onHistory={historyDrawer.open}
                                >
                                    <ExerciseCard />
                                </WorkoutExerciseProvider>
                            </motion.div>
                        );
                    },
                )}

                <AddExerciseDrawer />

                <ExerciseHistoryDrawer {...historyDrawer.props} />
            </div>
        </DisclosureProvider>
    );
}
