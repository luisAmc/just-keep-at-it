import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { ConfirmationModal } from '~/components/shared/ConfirmationModal';
import { EditNameModal } from './EditNameModal';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useModal } from '~/components/shared/Modal';
import { useRouter } from 'next/router';
import { useWorkout } from '../useWorkout';
import toast from 'react-hot-toast';

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

            <EditNameModal {...editNameModal.props} />

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
