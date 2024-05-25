import {
    CheckIcon,
    PlusIcon,
    SparklesIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Button, buttonVariants } from '~/components/shared/Button';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input, inputVariants } from '~/components/shared/Input';
import { SlideOver, SlideOverProps } from '~/components/shared/SlideOver';
import { useExercises } from '~/contexts/useExercises';
import { api } from '~/utils/api';
import { cn } from '~/utils/cn';

type ACTION_TYPE = { type: 'add' } | { type: 'change'; changeIndex: number };

export function useAddChangeExerciseSlideOver() {
    const [action, setAction] = useState<ACTION_TYPE | null>(null);

    return {
        open: (action: ACTION_TYPE) => {
            setAction(action);
        },
        close: () => setAction(null),
        props: {
            action: action,
            open: action !== null,
            onClose() {
                setAction(null);
            },
        },
    };
}

interface AddChangeExerciseSlideOverProps
    extends Omit<SlideOverProps, 'title' | 'children'> {
    action: ACTION_TYPE | null;
    onAdd(exerciseId: string): void;
    onChange(exerciseId: string, exerciseIndex: number): void;
}

type CATEGORY_TYPE = {
    id: string;
    name: string;
    exercises: {
        id: string;
        name: string;
        categoryName: string;
    }[];
};

export function AddChangeExerciseSlideOver({
    action,
    onAdd,
    onChange,
    open,
    onClose,
}: AddChangeExerciseSlideOverProps) {
    const [query, setQuery] = useState<string | null>(null);

    const { exercisesByCategory } = useExercises();

    const categories: Array<CATEGORY_TYPE> = useMemo(() => {
        if (!exercisesByCategory) {
            return [];
        }

        const safeQuery = query?.trim() ?? '';

        const categories = [];

        for (const category of exercisesByCategory) {
            const exercises = [];
            for (const exercise of category.exercises) {
                if (
                    exercise.name.toLowerCase().includes(safeQuery) ||
                    category.name.toLowerCase().includes(safeQuery)
                ) {
                    exercises.push({
                        id: exercise.id,
                        name: exercise.name,
                        categoryName: category.name,
                    });
                }
            }

            if (exercises.length > 0) {
                categories.push({
                    id: category.id,
                    name: category.name,
                    exercises: exercises,
                });
            }
        }

        return categories;
    }, [exercisesByCategory, query]);

    function handleExerciseClick(exerciseId: string) {
        if (!action) {
            return;
        }

        if (action.type === 'add') {
            onAdd(exerciseId);
        } else {
            onChange(exerciseId, action.changeIndex);
        }

        onClose();
    }

    return (
        <SlideOver
            open={open}
            onClose={onClose}
            title={
                action?.type === 'add'
                    ? 'Agregar ejercicio'
                    : 'Cambiar ejercicio'
            }
            top={
                <input
                    className={inputVariants()}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filtar por nombre..."
                />
            }
        >
            <div className="mb-6 space-y-4">
                {categories.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        onExerciseClick={handleExerciseClick}
                    />
                ))}

                {query && categories.length === 0 && (
                    <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
                        <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                            <SparklesIcon className="size-8" />

                            <p className="text-pretty text-center text-sm font-medium">
                                No hay ejercicios que cumplan con la búsqueda...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </SlideOver>
    );
}

interface CategorySectionProps {
    category: CATEGORY_TYPE;
    onExerciseClick(exerciseId: string): void;
}

function CategorySection({ category, onExerciseClick }: CategorySectionProps) {
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

const createExerciseSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nombre.'),
});

interface CreateExerciseInlineProps {
    categoryId: string;
    onClose: () => void;
}

function CreateExerciseInline({
    categoryId,
    onClose,
}: CreateExerciseInlineProps) {
    const form = useZodForm({ schema: createExerciseSchema });

    const queryClient = api.useUtils();
    const createExercise = api.exercise.create.useMutation({
        onSuccess() {
            queryClient.exercise.allByCategory.invalidate();
            onClose();
        },
    });

    async function handleSubmit() {
        const input = form.getValues();

        createExercise.mutateAsync({
            categoryId: categoryId,
            name: input.name,
        });
    }

    return (
        <Form form={form} onSubmit={handleSubmit}>
            <div className="space-y-2 border-t border-brand-300 pt-2">
                <ErrorMessage
                    title="Ocurrió un error..."
                    error={createExercise.error?.message}
                />

                <Input {...form.register('name')} placeholder="Nombre..." />

                <div className="flex items-center gap-x-2">
                    <Button disabled={!form.formState.isValid} className="w-full" onClick={handleSubmit}>
                        <CheckIcon className="mr-1 size-4" />
                        <span>Añadir</span>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full"
                    >
                        <XMarkIcon className="mr-1 size-4" />
                        <span>Cancelar</span>
                    </Button>
                </div>
            </div>
        </Form>
    );
}
