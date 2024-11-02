import { ExerciseCard } from './ExerciseCard';
import { WorkoutExerciseProvider } from '../../context/useWorkoutExercise';
import { DisclosureProvider } from '../../context/useDisclosure';
import { useWorkout } from '../../context/useWorkout';
import { motion } from 'framer-motion';
import { AddExerciseDrawer } from './AddExerciseDrawer';
import {
    ExerciseHistoryDrawer,
    useExerciseHistoryDrawer,
} from './ExerciseHistoryDrawer';

export function WorkoutExercises() {
    const { workoutExercisesFieldArray } = useWorkout();
    const historyDrawer = useExerciseHistoryDrawer();

    return (
        <DisclosureProvider>
            <div className="space-y-2">
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
                                layoutId={workoutExerciseField.id}
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
