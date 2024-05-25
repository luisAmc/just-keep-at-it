import {
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
    forwardRef,
} from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '~/utils/cn';
import { buttonVariants } from './Button';

type RadixDropdownMenuContentProps = ComponentPropsWithoutRef<
    typeof RadixDropdownMenu.Content
>;

interface DropdownProps extends RadixDropdownMenuContentProps {
    trigger: ReactNode;
    children: ReactNode;
}

export function Dropdown({
    trigger,
    children,
    className,
    sideOffset = 4,
    ...contentProps
}: DropdownProps) {
    return (
        <RadixDropdownMenu.Root>
            <RadixDropdownMenu.Trigger
                className={cn(
                    buttonVariants({ size: 'icon', variant: 'ghost' }),
                )}
            >
                {trigger}
            </RadixDropdownMenu.Trigger>

            <RadixDropdownMenu.Content
                sideOffset={sideOffset}
                className={cn(
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md',
                    className,
                )}
                {...contentProps}
            >
                {children}
            </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Root>
    );
}

const DropdownGroup = RadixDropdownMenu.Group;

const DropdownItem = forwardRef<
    ElementRef<typeof RadixDropdownMenu.Item>,
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <RadixDropdownMenu.Item
        ref={ref}
        className={cn(
            'relative flex cursor-default select-none items-center rounded-md px-3 py-2.5 text-sm outline-none transition-colors focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className,
        )}
        {...props}
    />
));
DropdownItem.displayName = RadixDropdownMenu.Item.displayName;

const DropdownLabel = forwardRef<
    ElementRef<typeof RadixDropdownMenu.Label>,
    ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <RadixDropdownMenu.Label
        ref={ref}
        className={cn(
            'px-2 py-1.5 text-xs font-medium text-brand-700',
            className,
        )}
        {...props}
    />
));
DropdownLabel.displayName = RadixDropdownMenu.Label.displayName;

export { DropdownItem, DropdownLabel, DropdownGroup };
