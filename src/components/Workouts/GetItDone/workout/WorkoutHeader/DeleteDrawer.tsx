import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useRouter } from 'next/router';
import { useWorkout } from '../../context/useWorkout';
import { Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

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
            <Button variant="destructive" size="xs" onClick={deleteDrawer.open}>
                <Trash2Icon className="mr-1 size-4" />
                <span>Descartar</span>
            </Button>

            <Drawer {...deleteDrawer.props}>
                <div className="rounded-xl p-4 text-sm text-rose-700 ring-2 ring-rose-400">
                    <h2 className="mb-4 text-lg font-medium">
                        Descartar rútina
                    </h2>

                    <p className="text-center">
                        ¿Estás seguro(a) de descartar esta rútina?
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
                                loading: 'Descartando rútina...',
                                success: '¡Rútina descartada!',
                                error: 'No se pudo descartar la rútina.',
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
