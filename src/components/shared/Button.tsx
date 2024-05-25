import { VariantProps, cva } from 'class-variance-authority';
import { ButtonOrLink, ButtonOrLinkProps } from './ButtonOrLink';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-brand-700 text-brand-50 hover:bg-brand-700/90',
                secondary: 'bg-gray-300 text-gray-900 hover:bg-gray-300/80',
                destructive: 'bg-red-500 text-red-50 hover:bg-red-500/90',
                ghost: 'bg-transparent hover:bg-brand-200',
                outline: 'border hover:border-gray-300 hover:bg-gray-100',
                dashed: 'border border-dashed border-brand-300 hover:border-transparent hover:bg-brand-200',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-lg px-3',
                lg: 'h-11 rounded-lg px-8',
                xl: 'h-14 text-xl rounded-lg px-8',
                icon: 'h-8 w-8 rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends VariantProps<typeof buttonVariants>,
        ButtonOrLinkProps {
    loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        { variant, color, size, loading, children, className, ...props },
        ref,
    ) {
        return (
            <ButtonOrLink
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
                disabled={props.disabled || loading}
            >
                {children}
            </ButtonOrLink>
        );
    },
);
