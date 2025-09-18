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

export interface DrawerProps {
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
    // We use `NestedRoot` for the inside drawer to get the "stacked cards" effect.
    // Is not necessary, but looks cool.
    //
    // We leverage the `stacked` prop for this.
    const NestedOrFlatRoot = stacked ? VaulDrawer.NestedRoot : VaulDrawer.Root;

    return (
        <NestedOrFlatRoot
            open={open}
            onClose={onClose}
            dismissible={dismissable}
            repositionInputs={false}
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
                        'bg-background fixed right-0 bottom-0 left-0 mt-24 flex max-h-[96%] flex-col rounded-t-xl',
                        {
                            'h-full': size === 'tall',
                            'h-auto': size === 'small',
                        },
                        stacked ? 'z-40' : 'z-30',
                    )}
                >
                    <div
                        className={cn(
                            'h-full flex-1 rounded-t-xl p-4 pb-8',
                            scrollable && 'overflow-y-auto',
                        )}
                    >
                        <div className="mx-auto mb-4 h-2 w-20 shrink-0 rounded-full bg-gray-300" />

                        <div className="mx-auto w-full max-w-sm rounded-xl">
                            <VaulDrawer.Title className="text-lg font-medium">
                                {title}
                            </VaulDrawer.Title>

                            <div className="mt-4 flex flex-col gap-y-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </NestedOrFlatRoot>
    );
}
