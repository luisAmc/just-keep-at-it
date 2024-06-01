import { z } from 'zod';
import { Modal, ModalProps } from '~/components/shared/Modal';
import { useWorkout } from '../useWorkout';
import { Form, useZodForm } from '~/components/shared/Form';
import { api } from '~/utils/api';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { Input } from '~/components/shared/Input';
import toast from 'react-hot-toast';

const editNameSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nuevo nombre.'),
});

interface EditWorkoutNameModalProps
    extends Omit<ModalProps, 'title' | 'children'> {}

export function EditWorkoutNameModal({
    open,
    onClose,
}: EditWorkoutNameModalProps) {
    const { workoutId, name, setName } = useWorkout();

    const form = useZodForm({
        schema: editNameSchema,
        defaultValues: { name: name },
    });

    const editName = api.workout.editName.useMutation({
        onSuccess(data) {
            setName(data.name);
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
                            workoutId: workoutId,
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
