import { Button } from '~/components/shared/Button';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';
import { cn } from '~/utils/cn';
import { CardActions } from './CardActions';
import { ChevronUpIcon } from 'lucide-react';

export function CardHeader() {
    const { label, name, setCount, isOpen, toggleOpen, onHistory } =
        useWorkoutExercise();

    return (
        <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-x-2">
                <span className="border-brand-600 flex size-9 shrink-0 items-center justify-center rounded-full border-2">
                    <span className="text-brand-600 space-x-0.5 text-xs font-semibold">
                        <span>{label}</span>
                    </span>
                </span>

                <Button
                    variant="ghost"
                    className="whitespace-normal px-1.5 text-start text-base text-wrap"
                    onClick={onHistory}
                >
                    {name}
                </Button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-x-2">
                <Button
                    variant="ghost"
                    className="space-x-2 px-1.5 text-base"
                    onClick={toggleOpen}
                >
                    <span className="text-sm">{setCount} sets</span>

                    <ChevronUpIcon
                        className={cn(
                            'h-4 w-4',
                            isOpen && 'rotate-180 transform',
                        )}
                    />
                </Button>

                <CardActions />
            </div>
        </div>
    );
}
