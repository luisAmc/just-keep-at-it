import { SparklesIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { inputVariants } from '~/components/shared/Input';
import { SlideOver, SlideOverProps } from '~/components/shared/SlideOver';
import { useExercises } from '~/contexts/useExercises';
import { CategorySection } from './CategorySection';

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

export type CATEGORY_TYPE = {
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
