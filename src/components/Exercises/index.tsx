import { useExercises } from '~/contexts/useExercises';
import { Page } from '../shared/Page';
import { useMemo, useState } from 'react';
import { CategorySection } from './CategorySection';
import {
    EditExerciseNameModal,
    useEditExerciseNameModal,
} from './EditExerciseNameModal';
import { inputVariants } from '../shared/Input';
import { Button } from '../shared/Button';
import { ChevronLeft, CatIcon } from 'lucide-react';

export type CATEGORY_TYPE = {
    id: string;
    name: string;
    exercises: {
        id: string;
        name: string;
        categoryName: string;
    }[];
};

export function Exercises() {
    const { exercisesByCategory } = useExercises();

    const editNameModal = useEditExerciseNameModal();

    const [query, setQuery] = useState<string | null>(null);

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

    return (
        <Page>
            <div className="flex items-center gap-x-1.5">
                <Button href="/" variant="ghost" size="icon">
                    <ChevronLeft className="size-5 stroke-2" />
                </Button>

                <h1 className="text-2xl font-medium">Ejercicios</h1>
            </div>

            <input
                className={inputVariants()}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre / categoría..."
            />

            {categories.map((category) => (
                <CategorySection
                    key={category.id}
                    category={category}
                    onEditName={editNameModal.open}
                />
            ))}

            {query && categories.length === 0 && (
                <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
                    <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                        <CatIcon className="size-8" />

                        <p className="text-pretty text-center text-sm font-medium">
                            No hay ejercicios que cumplan con la búsqueda...
                        </p>
                    </div>
                </div>
            )}

            {editNameModal.props.open && (
                <EditExerciseNameModal {...editNameModal.props} />
            )}
        </Page>
    );
}
