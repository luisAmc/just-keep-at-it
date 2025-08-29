import { AddOrChangeExercise } from '../AddOrChangeExerciseDrawer';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownUpIcon,
    EllipsisVerticalIcon,
    RefreshCwIcon,
    Trash2Icon,
    XIcon,
} from 'lucide-react';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { ReorderExercises } from '../ReorderExercises';
import { useState } from 'react';
import { useWorkout } from '../../../context/useWorkout';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';

type Action = 'default' | 'change-exercise' | 'reorder-exercises';

const DrawerTitle: Record<Action, string | null> = {
    default: null,
    'change-exercise': 'Cambiar ejercicio',
    'reorder-exercises': 'Reordenar ejercicios',
};

export function CardActions() {
    const { onRemove, workoutExerciseCount } = useWorkout();
    const { index, name, changeExercise } = useWorkoutExercise();

    const [selectedAction, setSelectedAction] = useState<Action>('default');

    const actionDrawer = useDrawer();

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    setSelectedAction('default');
                    actionDrawer.open();
                }}
            >
                <EllipsisVerticalIcon className="size-5" />
            </Button>

            <Drawer
                title={DrawerTitle[selectedAction] ?? name}
                scrollable
                size={selectedAction === 'change-exercise' ? 'tall' : 'small'}
                {...actionDrawer.props}
            >
                <AnimatePresence mode="wait">
                    {selectedAction === 'default' && (
                        <section
                            key="defautl"
                            className="flex flex-col gap-y-1"
                        >
                            <Button
                                variant="muted"
                                className="h-12 justify-start"
                                onClick={() =>
                                    setSelectedAction('change-exercise')
                                }
                            >
                                <RefreshCwIcon className="mr-1 size-4" />
                                <span>Cambiar ejercicio</span>
                            </Button>

                            <Button
                                variant="muted"
                                className="h-12 justify-start"
                                disabled={workoutExerciseCount === 1}
                                onClick={() =>
                                    setSelectedAction('reorder-exercises')
                                }
                            >
                                <ArrowDownUpIcon className="mr-1 size-4" />
                                <span>Reordenar ejercicios</span>
                            </Button>

                            <Button
                                variant="destructive"
                                className="mt-2 h-12 justify-start"
                                onClick={() => onRemove(index)}
                            >
                                <Trash2Icon className="mr-1 size-4" />
                                <span>Remover ejercicio</span>
                            </Button>
                        </section>
                    )}
                    {selectedAction === 'change-exercise' && (
                        <motion.section
                            key="change-exercise"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 1 }}
                        >
                            <AddOrChangeExercise
                                onExerciseClick={(exerciseId) => {
                                    changeExercise(exerciseId);
                                    actionDrawer.close();
                                }}
                            />
                        </motion.section>
                    )}
                    {selectedAction === 'reorder-exercises' && (
                        <motion.section
                            key="reorder-exercises"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 1 }}
                        >
                            <ReorderExercises />
                        </motion.section>
                    )}
                </AnimatePresence>

                {selectedAction !== 'default' && (
                    <Button variant="secondary" onClick={actionDrawer.close}>
                        <XIcon className="mr-1 size-4" />
                        <span>Cerrar</span>
                    </Button>
                )}
            </Drawer>
        </>
    );
}
