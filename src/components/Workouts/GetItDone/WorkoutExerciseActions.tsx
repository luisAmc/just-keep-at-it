import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsRightLeftIcon,
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useWorkoutExercise } from './useWorkoutExercise';
import { Button } from '~/components/shared/Button';
import { Drawer } from 'vaul';
import { useModal } from '~/components/shared/Modal';

export function WorkoutExerciseActions() {
    const actionModal = useModal();

    const { name, isFirst, isLast, onChange, onMove, onRemove } =
        useWorkoutExercise();

    function handleClick(action: () => void) {
        actionModal.close();
        action();
    }

    return (
        <Drawer.Root disablePreventScroll {...actionModal.props}>
            {/* To prevent double drawers for the extra drawer after clicking `Change exercise` */}
            {/* <Drawer.Trigger asChild> */}
            <Button size="icon" variant="ghost" onClick={actionModal.open}>
                <EllipsisVerticalIcon className="size-5" />
            </Button>
            {/* </Drawer.Trigger> */}

            <Drawer.Portal>
                <Drawer.Overlay
                    className="fixed inset-0 z-20 bg-black/40"
                    onClick={actionModal.close}
                />

                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex flex-col rounded-t-xl bg-zinc-100">
                    <div className="h-full flex-1 rounded-t-xl bg-white p-4">
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />

                        <div className="mx-auto max-w-md space-y-4">
                            <Drawer.Title className="text-lg font-medium">
                                {name}
                            </Drawer.Title>

                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-medium">
                                    Cambio
                                </div>

                                <Button
                                    variant="secondary"
                                    className="justify-start bg-slate-200"
                                    onClick={() => handleClick(onChange)}
                                >
                                    <ArrowsRightLeftIcon className="mr-1 size-4" />
                                    <span>Cambiar ejercicio</span>
                                </Button>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <div className="text-xs font-medium">
                                    Ubicación
                                </div>

                                <Button
                                    disabled={isFirst}
                                    variant="secondary"
                                    className="justify-start bg-slate-200"
                                    onClick={() =>
                                        handleClick(() => onMove('first'))
                                    }
                                >
                                    <ChevronDoubleUpIcon className="mr-1 size-4" />
                                    <span>Mover al incio</span>
                                </Button>

                                <Button
                                    disabled={isFirst}
                                    variant="secondary"
                                    className="justify-start bg-slate-200"
                                    onClick={() =>
                                        handleClick(() => onMove('up'))
                                    }
                                >
                                    <ArrowUpIcon className="mr-1 size-4" />
                                    <span>Mover arriba</span>
                                </Button>

                                <Button
                                    disabled={isLast}
                                    variant="secondary"
                                    className="justify-start bg-slate-200"
                                    onClick={() =>
                                        handleClick(() => onMove('down'))
                                    }
                                >
                                    <ArrowDownIcon className="mr-1 size-4" />
                                    <span>Mover abajo</span>
                                </Button>

                                <Button
                                    disabled={isLast}
                                    variant="secondary"
                                    className="justify-start bg-slate-200"
                                    onClick={() =>
                                        handleClick(() => onMove('last'))
                                    }
                                >
                                    <ChevronDoubleDownIcon className="mr-1 size-4" />
                                    <span>Mover al final</span>
                                </Button>
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-medium text-rose-700">
                                    Peligro
                                </div>

                                <Button
                                    variant="destructive"
                                    className="h-10"
                                    onClick={() => handleClick(onRemove)}
                                >
                                    <TrashIcon className="mr-1 size-4" />
                                    <span>Remover ejercicio</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
