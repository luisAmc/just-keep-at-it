import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { z } from 'zod';
import toast from 'react-hot-toast';

const createExerciseSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nombre.'),
});

interface CreateExerciseInlineProps {
    categoryId: string;
    onClose: () => void;
}

export function CreateExerciseInline({
    categoryId,
    onClose,
}: CreateExerciseInlineProps) {
    const form = useZodForm({ schema: createExerciseSchema });

    const queryClient = api.useUtils();
    const createExercise = api.exercise.create.useMutation({
        onSuccess() {
            queryClient.exercise.allByCategory.invalidate();
            onClose();
        },
    });

    async function handleSubmit() {
        const input = form.getValues();

        toast.promise(
            createExercise.mutateAsync({
                categoryId: categoryId,
                name: input.name,
            }),
            {
                loading: 'Creando ejercicio...',
                success: '¡Ejercicio creado!',
                error: 'No se pudo crear el ejercicio.',
            },
        );
    }

    return (
        <Form form={form} onSubmit={handleSubmit}>
            <div className="space-y-2 border-t border-brand-300 pt-2">
                <ErrorMessage
                    title="Ocurrió un error..."
                    error={createExercise.error?.message}
                />

                <Input
                    {...form.register('name')}
                    placeholder="Nombre del nuevo ejercicio..."
                />

                <div className="flex items-center gap-x-2">
                    <Button
                        loading={createExercise.isLoading}
                        disabled={!form.formState.isValid}
                        className="w-full"
                        onClick={handleSubmit}
                    >
                        <CheckIcon className="mr-1 size-4" />
                        <span>Añadir</span>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full"
                    >
                        <XMarkIcon className="mr-1 size-4" />
                        <span>Cancelar</span>
                    </Button>
                </div>
            </div>
        </Form>
    );
}
