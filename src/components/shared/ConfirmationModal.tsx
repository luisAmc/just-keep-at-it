import { Modal, ModalProps } from './Modal';
import { Button } from './Button';
import { Trash2Icon, XIcon } from 'lucide-react';

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
                    <Trash2Icon className="h-8 w-8 text-red-500" />
                </div>

                <div className="text-center font-medium">{children}</div>

                <div className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                    <Button variant="destructive" onClick={onConfirm}>
                        <Trash2Icon className="mr-1 size-4" />
                        <span>Confirmar</span>
                    </Button>

                    <Button variant="secondary" className='bg-gray-200' onClick={onClose}>
                        <XIcon className="mr-1 size-4" />
                        <span>Cancelar</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
