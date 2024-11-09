import { z } from 'zod';
import { Form, useZodForm } from '../shared/Form';
import { Input } from '../shared/Input';
import { Modal, ModalProps } from '../shared/Modal';
import { SubmitButton } from '../shared/SubmitButton';
import { Button } from '../shared/Button';
import { useSlideOver } from '../shared/SlideOver';
import {
    AddExerciseSlideOver,
    SelectedExerciseType,
} from './AddExerciseSlideOver';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CatIcon, PlusIcon, Trash2Icon } from 'lucide-react';

const createTemplateSchema = z.object({
    name: z.string().trim().min(1, 'Ingrese el nombre.'),
    exercises: z
        .array(z.object({ exerciseId: z.string() }))
        .min(1, 'Seleccione al menos un ejercicio.'),
});

interface CreateTemplateModalProps
    extends Omit<ModalProps, 'title' | 'children'> {}

export function CreateTemplateModal({
    open,
    onClose,
}: CreateTemplateModalProps) {
    const form = useZodForm({ schema: createTemplateSchema });

    const queryClient = api.useUtils();
    const createMutation = api.workoutTemplate.create.useMutation({
        onSuccess() {
            queryClient.workoutTemplate.all.invalidate();
            form.reset();
            onClose();
        },
    });

    return (
        <Modal title="Crear Boceto" open={open} onClose={onClose}>
            <Form
                form={form}
                onSubmit={(input) =>
                    toast.promise(
                        createMutation.mutateAsync({
                            name: input.name,
                            exercises: input.exercises.map(
                                ({ exerciseId }, idx) => ({
                                    exerciseId: exerciseId,
                                    exerciseIndex: idx,
                                }),
                            ),
                        }),
                        {
                            loading: 'Creando boceto...',
                            success: '¡Boceto creado!',
                            error: 'No se pudo creada el boceto.',
                        },
                    )
                }
            >
                <ErrorMessage
                    title="Error de creación"
                    error={createMutation.error?.message}
                />

                <Input {...form.register('name')} label="Nombre" />

                <SelectedExercises />

                <SubmitButton>
                    <span>Crear Boceto</span>
                </SubmitButton>
            </Form>
        </Modal>
    );
}

function SelectedExercises() {
    const form = useFormContext();

    const exercises = useFieldArray({
        control: form.control,
        name: 'exercises',
    });

    function handleNewExercises(exercisesToAdd: Array<SelectedExerciseType>) {
        for (const exerciseToAdd of exercisesToAdd) {
            exercises.append(exerciseToAdd);
        }
    }

    const addSlideOver = useSlideOver();

    return (
        <>
            <div className=" text-sm font-medium leading-none text-brand-800">
                Ejercicios
            </div>

            {exercises.fields.length > 0 ? (
                <div>
                    <div className="divide-y">
                        {exercises.fields.map((selectedExercise, idx) => (
                            <div
                                key={selectedExercise.id}
                                className="flex w-full items-center justify-between px-4 py-2.5"
                            >
                                <span className="space-x-1.5">
                                    <span className="text-sm font-medium">
                                        {idx + 1}.
                                    </span>
                                    <span>
                                        {(selectedExercise as any).name}
                                    </span>
                                </span>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => exercises.remove(idx)}
                                >
                                    <Trash2Icon className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="dashed"
                        onClick={addSlideOver.open}
                        className="w-full"
                    >
                        <PlusIcon className="mr-1 size-4" />
                        <span>Agregar más</span>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-3 rounded-xl bg-brand-50 p-4">
                    <CatIcon className="size-8" />

                    <p className="text-sm font-semibold">
                        No se han agregado ejercicios...
                    </p>

                    <Button
                        variant="dashed"
                        onClick={addSlideOver.open}
                        className="w-full"
                    >
                        <PlusIcon className="mr-1 size-4" />
                        <span>Agregar ejercicios</span>
                    </Button>
                </div>
            )}

            <AddExerciseSlideOver
                {...addSlideOver.props}
                onConfirm={handleNewExercises}
            />
        </>
    );
}
