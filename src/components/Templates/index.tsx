import { api } from '~/utils/api';
import { Page } from '../shared/Page';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button } from '../shared/Button';
import { useModal } from '../shared/Modal';
import { CreateTemplateModal } from './CreateTemplateModal';

export function Templates() {
    const createModal = useModal();

    const { data, isLoading } = api.workoutTemplate.all.useQuery();

    const templates = data ?? [];

    return (
        <Page>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium">Bocetos</h1>

                <Button size="sm" onClick={createModal.open}>
                    <PlusIcon className="mr-1 size-4" />
                    <span>Crear boceto</span>
                </Button>
                <CreateTemplateModal {...createModal.props} />
            </div>

            {/* TODO: add shimmer */}
            {isLoading && <div>Cargando...</div>}

            {!isLoading &&
                (templates.length > 0 ? (
                    templates.map((template) => (
                        <div
                            key={template.id}
                            className="rounded-xl bg-brand-50 p-4"
                        >
                            <h4 className="mb-2 text-xl font-semibold text-brand-800">
                                {template.name}
                            </h4>

                            <div className="divide-y divide-gray-200">
                                {template.exercises.map((exercise, idx) => (
                                    <div
                                        key={exercise.id}
                                        className="space-x-1.5 px-4 py-2"
                                    >
                                        <span className="text-sm font-medium">
                                            {idx + 1}.
                                        </span>
                                        <span>{exercise.exercise.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* TODO: add actions */}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
                        <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                            <SparklesIcon className="size-8" />

                            <p className="text-sm font-semibold">
                                No se han creado bocetos...
                            </p>
                        </div>
                    </div>
                ))}
        </Page>
    );
}
