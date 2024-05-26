import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';

export const inputVariants = cva([
    'px-3 py-2 text-[16px] md:text-sm h-10 w-full rounded-lg border-b border-solid border-brand-200 text-brand-800 placeholder:text-brand-600',
    'focus:border-brand-200 focus:outline-none',
    'disabled:opacity-60 disabled:pointer-events-none',
    'appearance-none transition ease-in-out',
]);

interface SimpleInputProps
    extends VariantProps<typeof inputVariants>,
        ComponentPropsWithRef<'input'> {}

export const SimpleInput = forwardRef<HTMLInputElement, SimpleInputProps>(
    function Input({ type = 'text', className, ...props }, ref) {
        return (
            <input
                className={inputVariants({ className })}
                ref={ref}
                type={type}
                step={type === 'number' ? 'any' : undefined}
                autoComplete={props.autoComplete || 'off'}
                placeholder={`${props.placeholder}...`}
                onWheel={(event) =>
                    event.target instanceof HTMLElement && event.target.blur()
                }
                {...props}
            />
        );
    },
);
