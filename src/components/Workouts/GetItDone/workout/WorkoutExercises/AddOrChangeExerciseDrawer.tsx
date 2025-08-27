import { useMemo, useState } from 'react';
import { CATEGORY_TYPE } from '~/components/Exercises';
import { Button } from '~/components/shared/Button';
import { Drawer } from '~/components/shared/Drawer';
import { Input } from '~/components/shared/Input';
import { useExercises } from '~/contexts/useExercises';
import { CreateExerciseInline } from './CreateExerciseInline';
import { CircleHelp, PlusIcon } from 'lucide-react';

interface AddOrChangeExerciseDrawerProps extends AddOrChangeExerciseProps {
    open: boolean;
    onClose: () => void;
}

export function AddOrChangeExerciseDrawer({
    open,
    onClose,
    onExerciseClick,
}: AddOrChangeExerciseDrawerProps) {
    function handleClose() {
        onClose();
    }

    return (
        <Drawer
            title="Añadir otro ejercicio"
            size="tall"
            stacked
            scrollable
            open={open}
            onClose={handleClose}
        >
            <AddOrChangeExercise onExerciseClick={onExerciseClick} />
        </Drawer>
    );
}

interface AddOrChangeExerciseProps {
    onExerciseClick: (exerciseId: string) => void;
}

export function AddOrChangeExercise({
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

    function handleExerciseClick(exerciseId: string) {
        setSearchQuery(null);
        onExerciseClick(exerciseId);
    }

    return (
        <>
            <Input
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por nombre o categoría..."
            />

            <div className="divide-brand-100 divide-y">
                {categories.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        onExerciseClick={handleExerciseClick}
                    />
                ))}

                {searchQuery && categories.length === 0 && (
                    <div className="divide-brand-700 bg-brand-50 flex flex-col rounded-lg px-4 py-6">
                        <div className="text-brand-600 flex flex-col items-center space-y-3 rounded-md">
                            <CircleHelp className="size-10" />

                            <p className="text-center text-sm font-semibold text-pretty">
                                No hay ejercicios que cumplan con la búsqueda...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
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

            <div className="mt-2 mb-2 space-y-0.5">
                {category.exercises.map((exercise) => (
                    <Button
                        key={exercise.id}
                        variant="muted"
                        size="lg"
                        className="w-full justify-start px-4"
                        onClick={() => onExerciseClick(exercise.id)}
                    >
                        {exercise.name}
                    </Button>
                ))}
            </div>

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
                    <span>Añadir uno nuevo</span>
                </Button>
            )}
        </div>
    );
}
