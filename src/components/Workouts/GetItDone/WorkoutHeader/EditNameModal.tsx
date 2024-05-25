import { z } from 'zod';
import { Modal, ModalProps } from '~/components/shared/Modal';
import { useWorkout } from '../useWorkout';
import { Form, useZodForm } from '~/components/shared/Form';
import { api } from '~/utils/api';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { Input } from '~/components/shared/Input';

const editNameSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nuevo nombre.'),
});

interface EditNameModalProps extends Omit<ModalProps, 'title' | 'children'> {}

export function EditNameModal({ open, onClose }: EditNameModalProps) {
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
                    editName.mutateAsync({
                        workoutId: workoutId,
                        name: input.name,
                    })
                }
            >
                <Input {...form.register('name')} label="Nuevo nombre" />

                <SubmitButton>Editar</SubmitButton>
            </Form>
        </Modal>
    );
}
