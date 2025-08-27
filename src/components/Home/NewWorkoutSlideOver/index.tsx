import { RouterOutputs, api } from '~/utils/api';
import { SlideOver, SlideOverProps } from '~/components/shared/SlideOver';
import { CreateWorkoutButton } from './CreateWorkoutButton';
import { EmptyTemplates } from './EmptyTemplates';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '~/components/shared/Button';
import { useRouter } from 'next/router';
import { CheckIcon, XIcon } from 'lucide-react';

interface NewWorkoutSlideOverProps
    extends Omit<SlideOverProps, 'title' | 'children'> {}

export function NewWorkoutSlideOver({
    open,
    onClose,
}: NewWorkoutSlideOverProps) {
    const router = useRouter();
    const queryClient = api.useUtils();

    const { data, isLoading } = api.workoutTemplate.all.useQuery();

    const createMutation = api.workoutTemplate.startFromTemplate.useMutation({
        onSuccess(data) {
            queryClient.workout.infinite.invalidate();
            router.push(`/workouts/${data.id}/get-it-done`);
        },
    });

    const templates = data ?? [];

    return (
        <SlideOver title="Nueva rútina" open={open} onClose={onClose}>
            <div className="space-y-4">
                <h3 className="text-xl">¿Usar un boceto?</h3>

                {/* Todo: add shimmer */}
                {isLoading && <div>Cargando...</div>}

                {!isLoading &&
                    (templates.length > 0 ? (
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onClick={() =>
                                        toast.promise(
                                            createMutation.mutateAsync({
                                                templateId: template.id,
                                            }),
                                            {
                                                loading: 'Creando rútina...',
                                                success: '¡Rútina creada!',
                                                error: 'No se pudo creada la rutina.',
                                            },
                                        )
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyTemplates />
                    ))}

                <CreateWorkoutButton />
            </div>
        </SlideOver>
    );
}

interface TemplateCardProps {
    template: RouterOutputs['workoutTemplate']['all'][number];
    onClick(): void;
}

function TemplateCard({ template, onClick }: TemplateCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <div className="rounded-lg bg-brand-100 shadow-sm">
            <button
                className="w-full rounded-lg p-4 text-start"
                onClick={() => setShowConfirmation(true)}
            >
                <h3 className="text-lg font-medium">{template.name}</h3>

                {template.exercises.map(({ id, exercise }, idx) => (
                    <div key={id} className="space-x-1.5">
                        <span className="text-xs font-medium">{idx + 1}.</span>
                        <span className="text-sm">{exercise.name}</span>
                    </div>
                ))}
            </button>

            {showConfirmation && (
                <div className="border-t border-brand-200 p-4">
                    <p className="text-center text-sm font-semibold">
                        ¿Crear una rútina con este boceto?
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-x-2">
                        <Button className="w-full" size="sm" onClick={onClick}>
                            <CheckIcon className="mr-1 size-4" />
                            <span>Sí, crearla</span>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full"
                            size="sm"
                            onClick={() => setShowConfirmation(false)}
                        >
                            <XIcon className="mr-1 size-4" />
                            <span>Cancelar</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
