import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithRef, forwardRef } from 'react';

export const simpleTextareaVariants = cva([
    'field-sizing-content resize-none px-3 py-2 text-[16px] w-full rounded-lg text-brand-800 placeholder:text-brand-600',
    'focus:outline-none',
    'disabled:opacity-60 disabled:pointer-events-none',
    'appearance-none transition ease-in-out',
]);

interface SimpleTextareaProps
    extends VariantProps<typeof simpleTextareaVariants>,
        ComponentPropsWithRef<'textarea'> {}

export const SimpleTextarea = forwardRef<
    HTMLTextAreaElement,
    SimpleTextareaProps
>(function SimpleTextarea({ className, ...props }, ref) {
    return (
        <textarea
            className={simpleTextareaVariants({ className })}
            ref={ref}
            placeholder={`${props.placeholder}...`}
            onWheel={(event) =>
                event.target instanceof HTMLElement && event.target.blur()
            }
            rows={1}
            autoFocus={false}
            {...props}
        />
    );
});
