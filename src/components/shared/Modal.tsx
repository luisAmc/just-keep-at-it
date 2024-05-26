import { Fragment, type ReactNode, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';

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
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 pb-8 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
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
                                        <XMarkIcon className="size-6" />
                                    </Button>
                                </div>

                                <div className="pt-6">{children}</div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
