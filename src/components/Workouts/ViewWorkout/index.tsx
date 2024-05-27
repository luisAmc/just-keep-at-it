import {
    ArrowPathIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { ExerciseType } from '@prisma/client';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '~/components/shared/ConfirmationModal';
import {
    Dropdown,
    DropdownGroup,
    DropdownItem,
    DropdownLabel,
} from '~/components/shared/Dropdown';
import { useModal } from '~/components/shared/Modal';
import { api } from '~/utils/api';
import { Shimmer } from './Shimmer';

export function ViewWorkout() {
    const router = useRouter();

    const { data, isLoading } = api.workout.byId.useQuery({
        workoutId: router.query.workoutId as string,
    });

    const queryClient = api.useUtils();

    const doItAgain = api.workout.doItAgain.useMutation({
        onSuccess(data) {
            router.push(`/workouts/${data.id}/get-it-done`);
        },
    });

    const deleteWorkout = api.workout.delete.useMutation({
        onSuccess() {
            queryClient.workout.infinite.invalidate();
            router.replace('/');
        },
    });

    const confirmationModal = useModal();

    return (
        <div className="flex flex-col gap-y-4">
            {isLoading && <Shimmer />}

            {data && (
                <div className="space-y-4 rounded-xl bg-brand-50 px-4 pb-8 pt-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl">{data.name}</h1>

                        <Dropdown
                            className="mx-4"
                            trigger={
                                <EllipsisVerticalIcon className="size-5" />
                            }
                        >
                            <DropdownLabel>Acciones</DropdownLabel>
                            <DropdownGroup>
                                <DropdownItem
                                    onSelect={() =>
                                        toast.promise(
                                            doItAgain.mutateAsync({
                                                workoutId: data.id,
                                            }),
                                            {
                                                loading: 'Creando rútina...',
                                                success: '¡Rútina creada!',
                                                error: 'No se pudo creada la rútina.',
                                            },
                                        )
                                    }
                                >
                                    <ArrowPathIcon className="mr-1 size-4" />
                                    <span>Crear de nuevo</span>
                                </DropdownItem>
                            </DropdownGroup>

                            <DropdownLabel>Peligro</DropdownLabel>
                            <DropdownGroup>
                                <DropdownItem
                                    onSelect={confirmationModal.open}
                                    className="text-red-600"
                                >
                                    <TrashIcon className="mr-1 size-4" />
                                    <span>Remover ejercicio</span>
                                </DropdownItem>
                            </DropdownGroup>
                        </Dropdown>

                        <ConfirmationModal
                            {...confirmationModal.props}
                            onConfirm={() =>
                                toast.promise(
                                    deleteWorkout.mutateAsync({
                                        workoutId: data.id,
                                    }),
                                    {
                                        loading: 'Borrando rútina...',
                                        success: '¡Rútina borrada!',
                                        error: 'No se pudo borrar la rútina.',
                                    },
                                )
                            }
                        >
                            ¿Está seguro(a) de borrar la rútina?
                        </ConfirmationModal>
                    </div>

                    <div className="space-y-2">
                        {data.workoutExercises.map((workoutExercise) => {
                            const isAerobic =
                                workoutExercise.exercise.category.type ===
                                ExerciseType.AEROBIC;

                            return (
                                <div
                                    key={workoutExercise.id}
                                    className="rounded-xl bg-brand-100 p-4"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-medium">
                                            {workoutExercise.exercise.name}
                                        </h2>

                                        <span className="text-sm font-medium">
                                            {workoutExercise.sets.length} sets
                                        </span>
                                    </div>

                                    {workoutExercise.notes && (
                                        <p className="mt-2 text-pretty px-2 text-xs">
                                            {workoutExercise.notes}
                                        </p>
                                    )}

                                    {/* Sets */}
                                    <div className="pt-2">
                                        {workoutExercise.sets.map((set) => (
                                            <div
                                                key={set.id}
                                                className="flex items-center justify-center"
                                            >
                                                {isAerobic ? (
                                                    <AerobicSet {...set} />
                                                ) : (
                                                    <StrengthSet {...set} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

interface AerobicSetProps {
    mins: number;
    distance: number;
    kcal: number;
}

function AerobicSet({ mins, distance, kcal }: AerobicSetProps) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <span>
                <span className="text-2xl font-medium">{mins}</span>
                <span className="ml-1">mins</span>
            </span>

            <span>
                <span className="text-2xl font-medium">{distance}</span>
                <span className="ml-1">dist</span>
            </span>

            <span>
                <span className="text-2xl font-medium">{kcal}</span>
                <span className="ml-1">kcal</span>
            </span>
        </div>
    );
}

interface StrengthSetProps {
    lbs: number;
    reps: number;
}

function StrengthSet({ lbs, reps }: StrengthSetProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <span>
                <span className="text-2xl font-medium">{lbs}</span>
                <span className="ml-1">lbs</span>
            </span>

            <span>
                <span className="text-2xl font-medium">{reps}</span>
                <span className="ml-1">reps</span>
            </span>
        </div>
    );
}
