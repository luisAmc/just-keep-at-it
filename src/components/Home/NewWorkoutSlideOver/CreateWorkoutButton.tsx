import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';

export function CreateWorkoutButton() {
    const router = useRouter();

    const createMutation = api.workout.create.useMutation({
        onSuccess(data) {
            router.replace(`/workouts/${data.id}/get-it-done`);
        },
    });

    return (
        <Button
            className="w-full"
            onClick={() =>
                toast.promise(
                    createMutation.mutateAsync({ name: 'Nueva rútina' }),
                    {
                        loading: 'Creando rútina...',
                        success: '¡Rútina creada!',
                        error: 'No se pudo creada la rútina.',
                    },
                )
            }
        >
            {createMutation.isPending && (
                <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}

            <PlusIcon className="mr-1 size-4" />
            <span>Crear una nueva rútina</span>
        </Button>
    );
}
