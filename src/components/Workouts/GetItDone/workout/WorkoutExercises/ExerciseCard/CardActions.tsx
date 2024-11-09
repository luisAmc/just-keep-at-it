import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';
import { type ReactNode } from 'react';
import { useWorkout } from '../../../context/useWorkout';
import { AddOrChangeExercise } from '../AddOrChangeExercise';
import {
    ArrowDownIcon,
    ArrowRightLeftIcon,
    ArrowUpIcon,
    ChevronsDownIcon,
    ChevronsUpIcon,
    EllipsisVerticalIcon,
    Trash2Icon,
} from 'lucide-react';

export function CardActions() {
    const { onMove, onRemove } = useWorkout();
    const { index, name, isFirst, isLast, changeExercise } =
        useWorkoutExercise();

    const actionDrawer = useDrawer();
    const changeExerciseDrawer = useDrawer();

    function handleClick(action: () => void) {
        actionDrawer.close();
        action();
    }

    return (
        <>
            <Button variant="ghost" size="icon" onClick={actionDrawer.open}>
                <EllipsisVerticalIcon className="size-5" />
            </Button>

            <Drawer title={name} {...actionDrawer.props}>
                <Section title="Cambio">
                    <Button
                        variant="secondary"
                        className="justify-start bg-slate-200"
                        onClick={changeExerciseDrawer.open}
                    >
                        <ArrowRightLeftIcon className="mr-1 size-4" />
                        <span>Cambiar ejercicio</span>
                    </Button>

                    <AddOrChangeExercise
                        onExerciseClick={(exerciseId) => {
                            changeExercise(exerciseId);
                            changeExerciseDrawer.close();
                            actionDrawer.close();
                        }}
                        {...changeExerciseDrawer.props}
                    />
                </Section>

                <Section title="Ubicación">
                    <Button
                        disabled={isFirst}
                        variant="secondary"
                        className="justify-start bg-slate-200"
                        onClick={() =>
                            handleClick(() => onMove(index, 'first'))
                        }
                    >
                        <ChevronsUpIcon className="mr-1 size-4" />
                        <span>Mover al incio</span>
                    </Button>

                    <Button
                        disabled={isFirst}
                        variant="secondary"
                        className="justify-start bg-slate-200"
                        onClick={() => handleClick(() => onMove(index, 'up'))}
                    >
                        <ArrowUpIcon className="mr-1 size-4" />
                        <span>Mover arriba</span>
                    </Button>

                    <Button
                        disabled={isLast}
                        variant="secondary"
                        className="justify-start bg-slate-200"
                        onClick={() => handleClick(() => onMove(index, 'down'))}
                    >
                        <ArrowDownIcon className="mr-1 size-4" />
                        <span>Mover abajo</span>
                    </Button>

                    <Button
                        disabled={isLast}
                        variant="secondary"
                        className="justify-start bg-slate-200"
                        onClick={() => handleClick(() => onMove(index, 'last'))}
                    >
                        <ChevronsDownIcon className="mr-1 size-4" />
                        <span>Mover al final</span>
                    </Button>
                </Section>

                <DangerSection title="Peligro">
                    <Button
                        variant="destructive"
                        className="h-10"
                        onClick={() => handleClick(() => onRemove(index))}
                    >
                        <Trash2Icon className="mr-1 size-4" />
                        <span>Remover ejercicio</span>
                    </Button>
                </DangerSection>
            </Drawer>
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-y-2">
            <div className="textsm font-medium">{title}</div>

            {children}
        </div>
    );
}

function DangerSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-y-2">
            <div className="text-sm font-medium text-rose-700">{title}</div>

            {children}
        </div>
    );
}
