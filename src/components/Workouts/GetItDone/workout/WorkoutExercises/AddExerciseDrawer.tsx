import { AddOrChangeExercise } from './AddOrChangeExercise';
import { Button } from '~/components/shared/Button';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useDrawer } from '~/components/shared/Drawer';
import { useWorkout } from '../../context/useWorkout';

export function AddExerciseDrawer() {
    const addExerciseDrawer = useDrawer();

    const { addExercise, workoutExerciseCount } = useWorkout();

    function onExerciseClick(exerciseId: string) {
        addExercise(exerciseId);
        addExerciseDrawer.close();
    }

    return (
        <>
            {workoutExerciseCount > 0 ? (
                <SmallButton onClick={addExerciseDrawer.open} />
            ) : (
                <BigButton onClick={addExerciseDrawer.open} />
            )}

            <AddOrChangeExercise
                onExerciseClick={onExerciseClick}
                {...addExerciseDrawer.props}
            />
        </>
    );
}

function SmallButton({ onClick }: { onClick: () => void }) {
    return (
        <Button variant="dashed" className="w-full" onClick={onClick}>
            <PlusIcon className="mr-1 size-4" />
            <span>Añadir otro ejercicio</span>
        </Button>
    );
}

function BigButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            variant="secondary"
            className="h-auto w-full flex-col px-6 py-8"
            onClick={onClick}
        >
            <SparklesIcon className="size-10 mb-3" />
            <span className="font-bold text-base">Añadir un ejercicio</span>
        </Button>
    );
}
