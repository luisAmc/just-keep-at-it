import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, type ReactNode, useState } from 'react';
import { Button } from './Button';
import { cn } from '~/utils/cn';

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
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
                                    <TransitionChild
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4"></div>
                                    </TransitionChild>

                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div
                                            className={cn(
                                                'sticky top-0 z-10 bg-white px-4 pb-4 pt-6 sm:px-6',
                                                top && 'space-y-4 border-b',
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <DialogTitle className="text-lg font-semibold leading-6 text-brand-900">
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

                                            {top}
                                        </div>

                                        <div className="relative mt-4 flex-1 px-4 sm:px-6">
                                            {children}
                                        </div>

                                        {bottom && (
                                            <div className="mt-4 sticky bottom-0 z-10 border-t bg-white px-4 pb-6 pt-4 sm:px-6 ">
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
