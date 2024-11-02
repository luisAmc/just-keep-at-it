import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type ReactNode, useState } from 'react';
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
        <Dialog open={open} className="relative z-10" onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
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
                                    <div className="sticky bottom-0 z-10 mt-4 border-t bg-white px-4 pb-6 pt-4 sm:px-6 ">
                                        {bottom}
                                    </div>
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
