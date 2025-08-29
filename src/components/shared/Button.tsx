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
                secondary: 'bg-brand-300 text-brand-900 hover:bg-brand-300/80',
                muted: 'bg-brand-100 text-brand-900 hover:opacity-80',
                destructive: 'bg-red-500 text-red-50 hover:bg-red-500/90',
                'destructive-dashed':
                    'border-2 border-dashed border-red-500  text-red-600 hover:border-transparent hover:bg-red-200',
                ghost: 'bg-transparent hover:bg-brand-200',
                outline:
                    'border border-brand-500 hover:border-brand-300 hover:bg-brand-100',
                dashed: 'text-brand-800 border-2 border-dashed border-brand-500 hover:border-transparent hover:bg-brand-200',
            },
            size: {
                default: 'h-10 px-4 py-2',
                xs: 'h-8 text-xs rounded-lg px-2',
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
                {loading && (
                    <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}

                {children}
            </ButtonOrLink>
        );
    },
);
