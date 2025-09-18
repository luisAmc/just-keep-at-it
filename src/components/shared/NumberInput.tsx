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
                        'bg-brand-200 h-10 w-16 appearance-none justify-center py-0.5 text-center text-xl outline-none',
                        'focus:border-brand-600 focus:ring-brand-500 rounded-md border-2 border-transparent',
                        'placeholder:text-brand-400 disabled:bg-opacity-20 disabled:bg-gray-500 disabled:opacity-60',
                        className,
                    )}
                    ref={ref}
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
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
