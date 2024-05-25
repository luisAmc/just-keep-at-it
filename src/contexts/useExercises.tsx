import { AnimatePresence, motion } from 'framer-motion';
import {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import { RouterOutputs, api } from '~/utils/api';

export type ExerciseType =
    RouterOutputs['exercise']['allByCategory'][number]['exercises'][number];

interface ExercisesContextType {
    exercisesByCategory: RouterOutputs['exercise']['allByCategory'] | undefined;
    getExerciseById(exerciseId: string): ExerciseType | undefined;
}

const ExercisesContext = createContext<ExercisesContextType | undefined>(
    undefined,
);

interface ExercisesProviderProps {
    children: ReactNode;
}

export function ExercisesProvider({ children }: ExercisesProviderProps) {
    const { data: exercisesByCategory, isLoading } =
        api.exercise.allByCategory.useQuery();

    const [exercisesById] = useState(() => new Map<string, ExerciseType>());

    useEffect(() => {
        if (!exercisesByCategory) {
            return;
        }

        for (const category of exercisesByCategory) {
            for (const exercise of category.exercises) {
                exercisesById.set(exercise.id, exercise);
            }
        }
    }, [exercisesByCategory]);

    const context: ExercisesContextType = {
        exercisesByCategory,
        getExerciseById: (exerciseId: string) => {
            return exercisesById.get(exerciseId);
        },
    };

    return (
        <ExercisesContext.Provider value={context}>
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="before-data"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 grid h-full place-items-center"
                    >
                        <img
                            src="/images/login.webp"
                            className="animate-swaying"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="after-data"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </ExercisesContext.Provider>
    );
}

export function useExercises() {
    const context = useContext(ExercisesContext);

    if (!context) {
        throw new Error(
            '`useExercises` can only be use inside a ExercisesProvider component.',
        );
    }

    return context;
}
