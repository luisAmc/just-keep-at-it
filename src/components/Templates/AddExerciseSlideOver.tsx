import { useMemo, useState } from 'react';
import { useExercises } from '~/contexts/useExercises';
import { SlideOver, SlideOverProps } from '../shared/SlideOver';
import { inputVariants } from '../shared/Input';
import { Button } from '../shared/Button';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { cn } from '~/utils/cn';

export type SelectedExerciseType = {
    exerciseId: string;
    name: string;
};

interface AddExerciseSlideOverProps
    extends Omit<SlideOverProps, 'title' | 'children'> {
    onConfirm(exercisesToAdd: Array<SelectedExerciseType>): void;
}

export function AddExerciseSlideOver({
    open,
    onClose,
    onConfirm,
}: AddExerciseSlideOverProps) {
    const [selectedExercises, setSelectedExercises] = useState<
        Record<string, boolean>
    >({});

    const [query, setQuery] = useState<string | null>(null);

    const { exercisesByCategory, getExerciseById } = useExercises();

    const categories = useMemo(() => {
        if (!exercisesByCategory) {
            return [];
        }

        const safeQuery = query?.trim().toLowerCase() ?? '';

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
        const alreadySelected = selectedExercises[exerciseId];

        if (alreadySelected) {
            const updatedSelectedExercises = { ...selectedExercises };
            delete updatedSelectedExercises[exerciseId];

            setSelectedExercises(updatedSelectedExercises);
        } else {
            const updatedSelectedExercises = {
                ...selectedExercises,
                [exerciseId]: true,
            };

            setSelectedExercises(updatedSelectedExercises);
        }
    }

    function handleAcceptClick() {
        const exercisesToAdd = [];

        for (const selectedExerciseId of Object.keys(selectedExercises)) {
            const exerciseInfo = getExerciseById(selectedExerciseId)!;

            exercisesToAdd.push({
                exerciseId: exerciseInfo.id,
                name: exerciseInfo.name,
            });
        }

        onConfirm(exercisesToAdd);
        setQuery(null);
        setSelectedExercises({});
        onClose();
    }

    const selectedExercisesCount = Object.keys(selectedExercises).length;

    return (
        <SlideOver
            title="Agregar ejercicios"
            open={open}
            onClose={onClose}
            top={
                <input
                    className={inputVariants()}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nombre / categoría..."
                />
            }
            bottom={
                <div className="flex flex-col gap-y-2">
                    <Button
                        disabled={selectedExercisesCount === 0}
                        onClick={handleAcceptClick}
                    >
                        {selectedExercisesCount > 0 ? (
                            <>
                                <PlusIcon className="mr-1 size-4" />
                                <span>
                                    Agregar ({selectedExercisesCount}{' '}
                                    ejercicios)
                                </span>
                            </>
                        ) : (
                            <span>Seleccione un ejercicio...</span>
                        )}
                    </Button>

                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category.id}>
                        <h3 className="tracking-tight">{category.name}</h3>

                        <div className="mt-2 space-y-2">
                            {category.exercises.map((exercise) => {
                                const isSelected =
                                    selectedExercises[exercise.id];

                                return (
                                    <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() =>
                                            handleExerciseClick(exercise.id)
                                        }
                                        className={cn(
                                            'w-full rounded-md border px-4 py-2.5 text-start text-sm',
                                            isSelected &&
                                                'border-brand-300 bg-brand-50',
                                        )}
                                    >
                                        <span>{exercise.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
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
