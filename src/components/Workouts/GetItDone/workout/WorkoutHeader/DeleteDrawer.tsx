import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useRouter } from 'next/router';
import { useWorkout } from '../../context/useWorkout';
import toast from 'react-hot-toast';
import { Trash2Icon } from 'lucide-react';

export function DeleteDrawer() {
    const { workoutId } = useWorkout();

    const deleteDrawer = useDrawer();
    const router = useRouter();
    const queryClient = api.useUtils();

    const deleteMutation = api.workout.delete.useMutation({
        onSuccess() {
            queryClient.workout.infinite.invalidate();
            router.replace('/');
        },
    });

    return (
        <>
            <Button
                variant="destructive"
                size="icon"
                onClick={deleteDrawer.open}
            >
                <Trash2Icon className="size-5" />
            </Button>

            <Drawer {...deleteDrawer.props}>
                <div className="rounded-xl p-4 text-rose-700 ring-2 ring-rose-400">
                    <h2 className="mb-6 text-xl font-medium">Borrar rútina</h2>

                    <p className="text-center">
                        ¿Estás seguro(a) de borrar esta rútina?
                    </p>

                    <p className="text-center font-medium underline">
                        Esta acción será irreversible.
                    </p>
                </div>

                <Button
                    variant="destructive"
                    onClick={() =>
                        toast.promise(
                            deleteMutation.mutateAsync({
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
                    <Trash2Icon className="mr-1 size-4" />
                    <span>Confirmar</span>
                </Button>
            </Drawer>
        </>
    );
}
