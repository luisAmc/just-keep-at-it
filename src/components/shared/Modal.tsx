import { type ReactNode, useState } from 'react';
import { Button } from './Button';
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import { XIcon } from 'lucide-react';

export function useModal() {
    const [open, setOpen] = useState(false);

    return {
        open: () => setOpen(true),
        close: () => setOpen(false),
        props: {
            open,
            onClose() {
                setOpen(false);
            },
        },
    };
}

export interface ModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
    return (
        <Dialog
            open={open}
            as="div"
            className="relative z-30"
            onClose={onClose}
        >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            <div className="fixed inset-0 z-40 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 pb-8 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative w-full max-w-md transform rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-medium">
                                {title}
                            </DialogTitle>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                            >
                                <XIcon className="size-6" />
                            </Button>
                        </div>

                        <div className="pt-6">{children}</div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
