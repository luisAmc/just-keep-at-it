import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal, ModalProps } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps extends Omit<ModalProps, 'title'> {
    type?: 'error';
    onConfirm(): void;
}

export function ConfirmationModal({
    type = 'error',
    onConfirm,
    open,
    onClose,
    children,
}: ConfirmationModalProps) {
    return (
        <Modal title="Borrar rútina" open={open} onClose={onClose}>
            <div className="flex flex-col gap-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100">
                    <TrashIcon className="h-8 w-8 text-red-500" />
                </div>

                <div className="text-center font-medium">{children}</div>

                <div className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                    <Button variant="destructive" onClick={onConfirm}>
                        <TrashIcon className="mr-1 size-4" />
                        <span>Confirmar</span>
                    </Button>

                    <Button variant="secondary" onClick={onClose}>
                        <XMarkIcon className="mr-1 size-4" />
                        <span>Cancelar</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
