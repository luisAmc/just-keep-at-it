import { ComponentPropsWithRef, forwardRef } from 'react';
import { cn } from '~/utils/cn';

interface NumberInputProps extends ComponentPropsWithRef<'input'> {
    label: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    function NumberInput({ label, className, ...props }, ref) {
        return (
            <label className="flex flex-col space-y-0.5">
                <input
                    className={cn(
                        'w-16 h-10 appearance-none justify-center bg-brand-200 py-0.5 text-center text-xl outline-none',
                        'rounded-md border-2 border-transparent focus:border-brand-600 focus:ring-brand-500',
                        'placeholder:text-brand-500 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60',
                        className,
                    )}
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    placeholder='0'
                    onFocus={(e) => e.target.select()}
                    onWheel={(event) =>
                        event.target instanceof HTMLElement &&
                        event.target.blur()
                    }
                    {...props}
                />

                <div className="text-center text-sm font-medium">{label}</div>
            </label>
        );
    },
);
