import { Button } from '~/components/shared/Button';
import { useWorkout } from './useWorkout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { api } from '~/utils/api';
import { useModal } from '~/components/shared/Modal';
import { ConfirmationModal } from '~/components/shared/ConfirmationModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { EditWorkoutNameModal } from './WorkoutHeader/EditWorkoutNameModal';

export function WorkoutHeader() {
    const { workoutId, name } = useWorkout();

    const router = useRouter();
    const queryClient = api.useUtils();

    const deleteWorkout = api.workout.delete.useMutation({
        onSuccess() {
            queryClient.workout.infinite.invalidate();
            router.replace('/');
        },
    });

    const editNameModal = useModal();
    const confirmationModal = useModal();

    return (
        <div className="flex items-center justify-between">
            <Button
                className="text-2xl"
                variant="ghost"
                onClick={editNameModal.open}
            >
                {name}
            </Button>

            <Button
                variant="destructive"
                size="icon"
                onClick={confirmationModal.open}
            >
                <TrashIcon className="size-5" />
            </Button>

            <EditWorkoutNameModal {...editNameModal.props} />

            <ConfirmationModal
                {...confirmationModal.props}
                onConfirm={() =>
                    toast.promise(
                        deleteWorkout.mutateAsync({
                            workoutId: workoutId,
                        }),
                        {
                            loading: 'Borrando rútina...',
                            success: '¡Rútina borrada!',
                            error: 'No se pudo borrar la rútina.',
                        },
                    )
                }
            >
                ¿Está seguro(a) de borrar la rútina?
            </ConfirmationModal>
        </div>
    );
}
