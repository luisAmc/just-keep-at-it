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
import { Modal, useModal } from '~/components/shared/Modal';
import { Button } from '~/components/shared/Button';

export function WorkoutExerciseActions() {
    const actionModal = useModal();

    const { isFirst, isLast, onChange, onMove, onRemove } =
        useWorkoutExercise();

    function handleClick(action: () => void) {
        actionModal.close();
        action();
    }

    return (
        <>
            <Button size="icon" variant="ghost" onClick={actionModal.open}>
                <EllipsisVerticalIcon className="size-5" />
            </Button>

            <Modal title="Acciones" {...actionModal.props}>
                <div className="flex flex-col gap-y-1.5">
                    <div className="mb-1 text-xs font-medium">Cambio</div>

                    <Button
                        variant="secondary"
                        className="justify-start bg-gray-100"
                        onClick={() => handleClick(onChange)}
                    >
                        <ArrowsRightLeftIcon className="mr-1 size-4" />
                        <span>Cambiar ejercicio</span>
                    </Button>
                </div>

                <div className="mt-6 flex flex-col gap-y-1.5">
                    <div className="mb-1 text-xs font-medium">Ubicación</div>

                    <Button
                        disabled={isFirst}
                        variant="secondary"
                        className="justify-start bg-gray-100"
                        onClick={() => handleClick(() => onMove('first'))}
                    >
                        <ChevronDoubleUpIcon className="mr-1 size-4" />
                        <span>Mover al incio</span>
                    </Button>

                    <Button
                        disabled={isFirst}
                        variant="secondary"
                        className="justify-start bg-gray-100"
                        onClick={() => handleClick(() => onMove('up'))}
                    >
                        <ArrowUpIcon className="mr-1 size-4" />
                        <span>Mover arriba</span>
                    </Button>

                    <Button
                        disabled={isLast}
                        variant="secondary"
                        className="justify-start bg-gray-100"
                        onClick={() => handleClick(() => onMove('down'))}
                    >
                        <ArrowDownIcon className="mr-1 size-4" />
                        <span>Mover abajo</span>
                    </Button>

                    <Button
                        disabled={isLast}
                        variant="secondary"
                        className="justify-start bg-gray-100"
                        onClick={() => handleClick(() => onMove('last'))}
                    >
                        <ChevronDoubleDownIcon className="mr-1 size-4" />
                        <span>Mover al final</span>
                    </Button>
                </div>

                <div className="mt-6 flex flex-col gap-y-1.5">
                    <div className="mb-1 text-xs font-medium text-red-700">
                        Peligro
                    </div>

                    <Button
                        variant="destructive"
                        onClick={() => handleClick(onRemove)}
                    >
                        <TrashIcon className="mr-1 size-4" />
                        <span>Remover ejercicio</span>
                    </Button>
                </div>
            </Modal>
        </>
    );
}
