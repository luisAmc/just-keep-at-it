import { useState, type ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '~/utils/cn';

export function useDrawer() {
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

interface DrawerProps {
    title?: string;
    size?: 'small' | 'tall';
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    stacked?: boolean;
    scrollable?: boolean;
    dismissable?: boolean;
}

export function Drawer({
    title,
    size = 'small',
    open,
    onClose,
    children,
    stacked = false,
    scrollable = false,
    dismissable = true,
}: DrawerProps) {
    return (
        <VaulDrawer.Root
            open={open}
            onClose={onClose}
            dismissible={dismissable}
        >
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay
                    className={cn(
                        'fixed inset-0 bg-black/40',
                        stacked ? 'z-30' : 'z-20',
                    )}
                    onClick={onClose}
                />

                <VaulDrawer.Content
                    aria-describedby={undefined}
                    className={cn(
                        'fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-xl bg-gray-100',
                        {
                            'h-full max-h-[96%]': size === 'tall',
                            'h-auto': size === 'small',
                        },
                        stacked ? 'z-40' : 'z-30',
                    )}
                >
                    <div
                        className={cn(
                            'h-full flex-1 rounded-t-xl bg-white p-4 pb-8',
                            scrollable && 'overflow-y-auto',
                        )}
                    >
                        <div className="mx-auto mb-6 h-2 w-[100px] flex-shrink-0 rounded-full bg-gray-200" />

                        <div className="mx-auto w-full max-w-sm">
                            <VaulDrawer.Title className="text-xl font-medium">
                                {title}
                            </VaulDrawer.Title>

                            <div className="mt-6 flex flex-col gap-y-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );
}
