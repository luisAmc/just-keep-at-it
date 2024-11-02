import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { useWorkout } from '../../context/useWorkout';
import { z } from 'zod';
import toast from 'react-hot-toast';

const editNameSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nuevo nombre.'),
});

export function EditNameDrawer() {
    const { workoutId, name, setName } = useWorkout();

    const editNameDrawer = useDrawer();

    const form = useZodForm({
        schema: editNameSchema,
        defaultValues: { name: name },
    });

    const editNameMutation = api.workout.editName.useMutation({
        onSuccess(data) {
            setName(data.name);
            editNameDrawer.close();
        },
    });

    return (
        <>
            <Button
                variant="ghost"
                className="text-2xl"
                onClick={editNameDrawer.open}
            >
                {name}
            </Button>

            <Drawer title="Editar nombre" {...editNameDrawer.props}>
                <Form
                    form={form}
                    onSubmit={(input) =>
                        toast.promise(
                            editNameMutation.mutateAsync({
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
                    <ErrorMessage
                        title="No se pudo editar el nombre"
                        error={editNameMutation.error?.message}
                    />

                    <Input
                        {...form.register('name')}
                        label="Nuevo nombre"
                        placeholder="¿Cuál será el nuevo nombre?"
                    />

                    <SubmitButton>Editar</SubmitButton>
                </Form>
            </Drawer>
        </>
    );
}
