import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Fragment, type ReactNode, useState } from 'react';
import { Button } from './Button';
import { cn } from '~/utils/cn';
import { XIcon } from 'lucide-react';

export function useSlideOver() {
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

export interface SlideOverProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    top?: ReactNode;
    bottom?: ReactNode;
    children?: ReactNode;
}

export function SlideOver({
    open,
    onClose,
    title,
    top,
    bottom,
    children,
}: SlideOverProps) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="ease-in-out duration-200"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
                                    <div className="bg-background flex h-full flex-col overflow-y-scroll shadow-xl">
                                        <div
                                            className={cn(
                                                'bg-background sticky top-0 z-10 px-4 pt-6 pb-4 sm:px-6',
                                                top && 'space-y-4 border-b',
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <DialogTitle className="text-brand-900 text-lg leading-6 font-semibold">
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

                                            {top}
                                        </div>

                                        <div className="relative mt-4 flex-1 px-4 sm:px-6">
                                            {children}
                                        </div>

                                        {bottom && (
                                            <div className="bg-background sticky bottom-0 z-10 mt-4 border-t px-4 pt-4 pb-6 sm:px-6">
                                                {bottom}
                                            </div>
                                        )}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
