import { AddOrChangeExercise } from './AddOrChangeExercise';
import { Button } from '~/components/shared/Button';
import { useDrawer } from '~/components/shared/Drawer';
import { useWorkout } from '../../context/useWorkout';
import { CatIcon, PlusIcon } from 'lucide-react';

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
            variant="dashed"
            className="h-auto w-full flex-col px-6 py-8"
            onClick={onClick}
        >
            <CatIcon className="mb-3 size-10" />
            <span className="text-base font-bold">Añadir un ejercicio</span>
        </Button>
    );
}
