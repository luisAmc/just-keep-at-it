import { AddOrChangeExercise } from '../AddOrChangeExercise';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useWorkout } from '../../../context/useWorkout';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';
import {
    ArrowDownUpIcon,
    EllipsisVerticalIcon,
    RefreshCwIcon,
    Trash2Icon,
} from 'lucide-react';
import { ReorderExercisesDrawer } from '../ReorderExercisesDrawer';

export function CardActions() {
    const { onRemove, workoutExerciseCount } = useWorkout();
    const { index, name, changeExercise } = useWorkoutExercise();

    const actionDrawer = useDrawer();
    const changeExerciseDrawer = useDrawer();
    const reorderDrawer = useDrawer();

    return (
        <>
            <Button variant="ghost" size="icon" onClick={actionDrawer.open}>
                <EllipsisVerticalIcon className="size-5" />
            </Button>

            <Drawer title={name} {...actionDrawer.props}>
                <section className="flex flex-col gap-y-2">
                    <Button
                        variant="muted"
                        className="h-12 justify-start"
                        onClick={changeExerciseDrawer.open}
                    >
                        <RefreshCwIcon className="mr-1 size-4" />
                        <span>Cambiar ejercicio</span>
                    </Button>

                    <Button
                        variant="muted"
                        className="h-12 justify-start"
                        disabled={workoutExerciseCount === 1}
                        onClick={reorderDrawer.open}
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

                    <AddOrChangeExercise
                        {...changeExerciseDrawer.props}
                        onExerciseClick={(exerciseId) => {
                            changeExercise(exerciseId);
                            changeExerciseDrawer.close();
                            actionDrawer.close();
                        }}
                    />

                    <ReorderExercisesDrawer
                        {...reorderDrawer.props}
                        onClose={() => {
                            actionDrawer.close();
                            reorderDrawer.close();
                        }}
                    />
                </section>
            </Drawer>
        </>
    );
}
