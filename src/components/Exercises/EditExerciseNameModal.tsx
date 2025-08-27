import { z } from 'zod';
import { Modal, ModalProps } from '../shared/Modal';
import { useState } from 'react';
import { Form, useZodForm } from '../shared/Form';
import { api } from '~/utils/api';
import { SubmitButton } from '../shared/SubmitButton';
import { Input } from '../shared/Input';
import { toast } from 'sonner';

export function useEditExerciseNameModal() {
    const [data, setData] = useState<
        | {
              name: string;
              exerciseId: string;
          }
        | undefined
    >(undefined);

    return {
        open: (name: string, exerciseId: string) => {
            setData({ name, exerciseId });
        },
        close: () => setData(undefined),
        props: {
            data,
            open: data !== undefined,
            onClose() {
                setData(undefined);
            },
        },
    };
}

const editNameSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nuevo nombre.'),
});

interface EditExerciseNameModalProps
    extends Omit<ModalProps, 'title' | 'children'> {
    data?: {
        name: string;
        exerciseId: string;
    };
}

export function EditExerciseNameModal({
    data = { exerciseId: '', name: '' },
    open,
    onClose,
}: EditExerciseNameModalProps) {
    const form = useZodForm({
        schema: editNameSchema,
        defaultValues: { name: data.name },
    });

    const queryClient = api.useUtils();
    const editName = api.exercise.editName.useMutation({
        onSuccess() {
            queryClient.exercise.allByCategory.invalidate();
            onClose();
        },
    });

    return (
        <Modal title="Editar nombre" open={open} onClose={onClose}>
            <Form
                form={form}
                onSubmit={(input) =>
                    toast.promise(
                        editName.mutateAsync({
                            exerciseId: data.exerciseId,
                            name: input.name,
                        }),
                        {
                            loading: 'Editando el nombre...',
                            success: '¡Nombre editado!',
                            error: 'No se pudo editar el nombre.',
                        },
                    )
                }
            >
                <Input {...form.register('name')} label="Nuevo nombre" />

                <SubmitButton>Editar</SubmitButton>
            </Form>
        </Modal>
    );
}
