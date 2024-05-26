import { useState } from 'react';
import { CATEGORY_TYPE } from '.';
import { CreateExerciseInline } from './CreateExerciseInline';
import { Button } from '../shared/Button';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CategorySectionProps {
    category: CATEGORY_TYPE;
    onEditName(name: string, exerciseId: string): void;
}

export function CategorySection({
    category,
    onEditName,
}: CategorySectionProps) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="rounded-lg bg-brand-100 p-4 shadow-sm">
            <h3 className="text-lg font-medium tracking-tight">
                {category.name}
            </h3>

            <div className="mt-2 space-y-2">
                {category.exercises.map((exercise) => {
                    return (
                        <div
                            key={exercise.id}
                            className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-brand-200 px-4 py-2 text-sm font-medium"
                        >
                            <span>{exercise.name}</span>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-brand-300"
                                onClick={() =>
                                    onEditName(exercise.name, exercise.id)
                                }
                            >
                                <PencilSquareIcon className="size-5" />
                            </Button>
                        </div>
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
