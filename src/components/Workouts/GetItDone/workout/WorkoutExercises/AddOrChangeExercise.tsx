import { useMemo, useState } from 'react';
import { CATEGORY_TYPE } from '~/components/Exercises';
import { Button } from '~/components/shared/Button';
import { Drawer } from '~/components/shared/Drawer';
import { inputVariants } from '~/components/shared/Input';
import { useExercises } from '~/contexts/useExercises';
import { CreateExerciseInline } from './CreateExerciseInline';
import { CircleHelp, PlusIcon } from 'lucide-react';

interface AddOrChangeExerciseProps {
    open: boolean;
    onClose: () => void;
    onExerciseClick: (exerciseId: string) => void;
}

export function AddOrChangeExercise({
    open,
    onClose,
    onExerciseClick,
}: AddOrChangeExerciseProps) {
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    const { exercisesByCategory } = useExercises();

    const categories: Array<CATEGORY_TYPE> = useMemo(() => {
        if (!exercisesByCategory) {
            return [];
        }

        const safeQuery = searchQuery?.trim().toLowerCase() ?? '';

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
    }, [exercisesByCategory, searchQuery]);

    return (
        <Drawer
            title="Añadir otro ejercicio"
            size="tall"
            stacked
            scrollable
            open={open}
            onClose={onClose}
        >
            <input
                className={inputVariants({
                    className:
                        'border-gray-200 placeholder:text-gray-400 focus:border-gray-200 focus:ring-gray-600',
                })}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por nombre / categoría..."
            />

            <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        onExerciseClick={onExerciseClick}
                    />
                ))}

                {searchQuery && categories.length === 0 && (
                    <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
                        <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                            <CircleHelp className="size-10" />

                            <p className="text-pretty text-center text-sm font-semibold">
                                No hay ejercicios que cumplan con la búsqueda...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
}

interface CategorySectionProps {
    category: CATEGORY_TYPE;
    onExerciseClick: (exerciseId: string) => void;
}

function CategorySection({ category, onExerciseClick }: CategorySectionProps) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="py-4">
            <h3 className="font-medium">{category.name}</h3>

            <div className="mt-2 space-y-2">
                {category.exercises.map((exercise) => (
                    <Button
                        key={exercise.id}
                        className="w-full justify-start bg-gray-100 font-normal text-gray-900 hover:bg-gray-300"
                        onClick={() => onExerciseClick(exercise.id)}
                    >
                        {exercise.name}
                    </Button>
                ))}

                {isCreating ? (
                    <CreateExerciseInline
                        categoryId={category.id}
                        onClose={() => setIsCreating(false)}
                    />
                ) : (
                    <Button
                        variant="dashed"
                        className="w-full border-gray-300 hover:bg-gray-300/90"
                        onClick={() => setIsCreating(true)}
                    >
                        <PlusIcon className="mr-1 size-4" />
                        <span>Crear un ejercicio</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
