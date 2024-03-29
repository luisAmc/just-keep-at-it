import { Exercise_ExerciseCategory } from '../__generated__/index.generated';
import { CategoryExerciseList } from './CategoryExerciseList';
import { CategoryHeader } from './CategoryHeader';
import { ExerciseCategoryProvider } from './useExerciseCategoryContext';

interface ExerciseListProps {
  categories: Exercise_ExerciseCategory[];
}

export function ExerciseList({ categories }: ExerciseListProps) {
  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className='bg-brand-100 text-brand-700 flex rounded-lg flex-col'
        >
          <ExerciseCategoryProvider category={category}>
            <CategoryHeader />
            <CategoryExerciseList />
          </ExerciseCategoryProvider>
        </div>
      ))}
    </>
  );
}
