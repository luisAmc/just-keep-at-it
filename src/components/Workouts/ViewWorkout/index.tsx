import { ExerciseType } from '@prisma/client';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { api } from '~/utils/api';
import { Shimmer } from './Shimmer';
import { Button } from '~/components/shared/Button';
import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    NotebookPenIcon,
    RefreshCcw,
    Trash2Icon,
} from 'lucide-react';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useState } from 'react';
import { Page } from '~/components/shared/Page';
import { AnimatePresence, motion } from 'framer-motion';

type Action = 'default' | 'create-template' | 'delete-workout';

export function ViewWorkout() {
    const router = useRouter();

    const [selectedAction, setSelectedAction] = useState<Action>('default');

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

    const actionDrawer = useDrawer();

    function handleDrawerClose() {
        setSelectedAction('default');
        actionDrawer.close();
    }

    return (
        <Page>
            {isLoading && <Shimmer />}

            {data && (
                <div className="space-y-4 rounded-xl pt-4 pb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-1.5">
                            <Button href="/" variant="ghost" size="icon">
                                <ArrowLeftIcon className="size-5 stroke-2" />
                            </Button>

                            <h1 className="text-2xl">{data.name}</h1>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setSelectedAction('default');
                                actionDrawer.open();
                            }}
                        >
                            <EllipsisVerticalIcon className="size-5" />
                        </Button>

                        <Drawer
                            title={data.name}
                            {...actionDrawer.props}
                            onClose={() => handleDrawerClose()}
                        >
                            <AnimatePresence mode="wait">
                                {selectedAction === 'default' && (
                                    <div
                                        key="default"
                                        className="flex flex-col gap-y-1"
                                    >
                                        <Button
                                            variant="muted"
                                            className="h-12 justify-start"
                                            onClick={() =>
                                                toast.promise(
                                                    doItAgain.mutateAsync({
                                                        workoutId: data.id,
                                                    }),
                                                    {
                                                        loading:
                                                            'Creando rútina...',
                                                        success:
                                                            '¡Rútina creada!',
                                                        error: 'No se pudo creada la rútina.',
                                                    },
                                                )
                                            }
                                        >
                                            <RefreshCcw className="mr-1 size-4" />
                                            <span>Repetir rútina</span>
                                        </Button>

                                        <Button
                                            disabled
                                            variant="muted"
                                            className="h-12 justify-start"
                                        >
                                            <NotebookPenIcon className="mr-1 size-4" />
                                            <span>Converitr en boceto</span>
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            className="mt-2 h-12 justify-start"
                                            onClick={() =>
                                                setSelectedAction(
                                                    'delete-workout',
                                                )
                                            }
                                        >
                                            <Trash2Icon className="mr-1 size-4" />
                                            <span>Borrar rútina</span>
                                        </Button>
                                    </div>
                                )}

                                {selectedAction === 'delete-workout' && (
                                    <motion.div
                                        key="delete-workout"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 1 }}
                                        className="flex flex-col gap-y-4"
                                    >
                                        <div className="rounded-xl p-4 text-sm text-rose-700 ring-2 ring-rose-400">
                                            <h2 className="mb-4 text-lg font-medium">
                                                Borrar rútina
                                            </h2>

                                            <p className="text-center">
                                                ¿Estás seguro(a) de borrar esta
                                                rútina?
                                            </p>

                                            <p className="text-center font-medium underline">
                                                Esta acción será irreversible.
                                            </p>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                toast.promise(
                                                    deleteWorkout.mutateAsync({
                                                        workoutId: data.id,
                                                    }),
                                                    {
                                                        loading:
                                                            'Borrando rútina...',
                                                        success:
                                                            '¡Rútina borrada!',
                                                        error: 'No se pudo borrar la rútina.',
                                                    },
                                                )
                                            }
                                        >
                                            <Trash2Icon className="mr-1 size-4" />
                                            <span>Confirmar</span>
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Drawer>
                    </div>

                    <div className="space-y-2">
                        {data.workoutExercises.map((workoutExercise) => {
                            const isAerobic =
                                workoutExercise.exercise.category.type ===
                                ExerciseType.AEROBIC;

                            return (
                                <div
                                    key={workoutExercise.id}
                                    className="bg-brand-100 rounded-lg p-4"
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

                                    {/* Sets */}
                                    <div className="mt-2">
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

                                    {workoutExercise.notes && (
                                        <div className="mt-2">
                                            <div className="text-xs font-bold">
                                                Notas:
                                            </div>
                                            <p className="text-xs text-pretty whitespace-pre">
                                                {workoutExercise.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Page>
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
