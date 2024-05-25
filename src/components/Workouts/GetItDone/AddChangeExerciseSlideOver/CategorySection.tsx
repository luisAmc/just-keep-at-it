import { Button, buttonVariants } from '~/components/shared/Button';
import { CATEGORY_TYPE } from '.';
import { cn } from '~/utils/cn';
import { CreateExerciseInline } from './CreateExerciseInline';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface CategorySectionProps {
    category: CATEGORY_TYPE;
    onExerciseClick(exerciseId: string): void;
}

export function CategorySection({ category, onExerciseClick }: CategorySectionProps) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="rounded-lg bg-brand-100 p-4 shadow-sm">
            <h3 className="text-lg font-medium tracking-tight">
                {category.name}
            </h3>

            <div className="mt-2 space-y-2">
                {category.exercises.map((exercise) => {
                    return (
                        <button
                            key={exercise.id}
                            type="button"
                            onClick={() => onExerciseClick(exercise.id)}
                            className={cn(
                                buttonVariants({
                                    variant: 'ghost',
                                }),
                                'w-full justify-start font-normal',
                            )}
                        >
                            <span>{exercise.name}</span>
                        </button>
                    );
                })}

                {isCreating ? (
                    <CreateExerciseInline
                        categoryId={category.id}
                        onClose={() => setIsCreating(false)}
                    />
                ) : (
                    <Button
                        variant="dashed"
                        className="w-full"
                        onClick={() => setIsCreating(true)}
                    >
                        <PlusIcon className="mr-1 size-4" />
                        <span>Añadir un ejercicio</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
