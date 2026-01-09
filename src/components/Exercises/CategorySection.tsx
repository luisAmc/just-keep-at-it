import { useState } from 'react';
import { CATEGORY_TYPE } from '.';
import { CreateExerciseInline } from './CreateExerciseInline';
import { Button } from '../shared/Button';
import { PencilIcon, PlusIcon } from 'lucide-react';

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
        <div className="bg-muted rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium tracking-tight">
                {category.name}
            </h3>

            <div className="mt-2 space-y-2">
                {category.exercises.map((exercise) => {
                    return (
                        <div
                            key={exercise.id}
                            className="bg-secondary inline-flex h-14 w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium"
                        >
                            <span>{exercise.name}</span>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onEditName(exercise.name, exercise.id)
                                }
                            >
                                <PencilIcon className="size-4" />
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
