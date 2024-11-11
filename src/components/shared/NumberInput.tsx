import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { useFormContext, useWatch } from 'react-hook-form';

interface Props extends ComponentProps<'input'> {
    name: string;
    label: string;
}

export const NumberInput = forwardRef<HTMLInputElement, Props>(
    function NumberInput({ label, name, ...props }, ref) {
        const form = useFormContext();
        const value = useWatch({ control: form.control, name });

        return (
            <label className="flex flex-col items-center justify-center">
                <input
                    className={clsx(
                        'w-16 appearance-none justify-center bg-brand-200 py-0.5 text-center text-xl outline-none',
                        'rounded-md border-2 border-transparent focus:border-brand-600 focus:ring-brand-500',
                        'placeholder:text-brand-500 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60',
                    )}
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="0"
                    value={value ?? ''}
                    onChange={(e) => form.setValue(name, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onWheel={(event) =>
                        event.target instanceof HTMLElement &&
                        event.target.blur()
                    }
                    {...props}
                />

                <div className="ml-1 text-sm font-medium">{label}</div>
            </label>
        );
    },
);
