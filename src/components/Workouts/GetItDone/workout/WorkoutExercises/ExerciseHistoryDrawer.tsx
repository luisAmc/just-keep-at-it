import { ExerciseType } from '@prisma/client';
import { CatIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/shared/Button';
import { Drawer } from '~/components/shared/Drawer';
import { useExercises } from '~/contexts/useExercises';
import { api, RouterOutputs } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

export function useExerciseHistoryDrawer() {
    const [_exerciseId, _setExerciseId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    return {
        open: (exerciseId: string) => {
            _setExerciseId(exerciseId);
            setOpen(true);
        },
        props: {
            exerciseId: _exerciseId,
            open,
            onClose() {
                setOpen(false);
            },
        },
    };
}

interface ExerciseHistoryDrawerProps {
    exerciseId: string | null;
    open: boolean;
    onClose: () => void;
}

export function ExerciseHistoryDrawer({
    exerciseId,
    open,
    onClose,
}: ExerciseHistoryDrawerProps) {
    const { data, isFetching } = api.exercise.history.useQuery(
        { exerciseId: exerciseId ?? '' },
        { enabled: !!exerciseId },
    );

    const { getExerciseById } = useExercises();
    const [exercise, setExercise] = useState({ name: '', isAerobic: false });

    useEffect(() => {
        const exerciseInfo = getExerciseById(exerciseId ?? '');
        setExercise({
            name: exerciseInfo?.name ?? '',
            isAerobic: exerciseInfo?.type === ExerciseType.AEROBIC,
        });
    }, [data]);

    const workoutExercises = data ?? [];

    return (
        <Drawer scrollable title={exercise.name} open={open} onClose={onClose}>
            <div className="space-y-4">
                {isFetching && <Shimmer />}

                {!isFetching &&
                    (workoutExercises.length > 0 ? (
                        <div className="mt-2 space-y-2">
                            {workoutExercises.map((workoutExercise) => (
                                <WorkoutExercise
                                    key={workoutExercise.id}
                                    workoutExercise={workoutExercise}
                                    isAerobic={exercise.isAerobic}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-muted-foreground bg-muted flex flex-col rounded-lg px-4 py-6">
                            <div className="text-muted-foreground flex flex-col items-center space-y-3 rounded-md">
                                <CatIcon className="size-8" />

                                <p className="text-center text-sm font-medium text-pretty">
                                    No se han completado rútinas con este
                                    ejercicio...
                                </p>
                            </div>
                        </div>
                    ))}

                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onClose}
                >
                    Cerrar
                </Button>
            </div>
        </Drawer>
    );
}

interface WorkoutExerciseProps {
    workoutExercise: RouterOutputs['exercise']['history'][number];
    isAerobic: boolean;
}

function WorkoutExercise({ isAerobic, workoutExercise }: WorkoutExerciseProps) {
    return (
        <div className="bg-muted rounded-xl px-8 py-4">
            <h3 className="text-lg font-semibold">
                {workoutExercise.workout?.name}
            </h3>

            <div className="text-muted-foreground text-xs font-semibold">
                {formatDate(
                    workoutExercise.completedAt!,
                    "dd MMMM yy 'a las' h:mm a",
                )}
            </div>

            <div className="mt-2">
                {workoutExercise.sets.map((set, setIdx) => (
                    <div key={set.id} className="space-x-1.5">
                        <span className="text-xs font-medium">
                            {setIdx + 1}.
                        </span>

                        <span className="text-sm">
                            {isAerobic ? (
                                <AerobicSet {...set} />
                            ) : (
                                <StrengthSet {...set} />
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {workoutExercise.notes && (
                <div className="mt-2">
                    <div className="text-xs font-bold">Notas:</div>
                    <p className="text-xs text-pretty whitespace-pre">
                        {workoutExercise.notes}
                    </p>
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
        <>
            <span>
                <span className="text-base">{mins}</span>
                <span className="text-xs">mins</span>
            </span>

            <span className="text-secondary text-sm">x</span>

            <span>
                <span className="text-base">{distance}</span>
                <span className="text-xs">dist</span>
            </span>

            <span className="text-secondary text-sm">x</span>

            <span>
                <span className="text-base">{kcal}</span>
                <span className="text-xs">kcal</span>
            </span>
        </>
    );
}

interface StrengthSetProps {
    lbs: number;
    reps: number;
}

function StrengthSet({ lbs, reps }: StrengthSetProps) {
    return (
        <>
            <span>
                <span className="text-base">{lbs}</span>
                <span className="text-xs">lbs</span>
            </span>

            <span className="text-secondary text-sm">x</span>

            <span>
                <span className="text-base">{reps}</span>
                <span className="text-xs">reps</span>
            </span>
        </>
    );
}

function Shimmer() {
    return (
        <div className="flex animate-pulse flex-col space-y-4">
            <div className="bg-muted rounded-xl p-3">
                <div className="flex flex-col space-y-2">
                    <div className="bg-secondary h-4 w-1/2 rounded-md"></div>
                    <div className="bg-secondary h-3 w-3/4 rounded-md"></div>

                    {/* Spacer */}
                    <div></div>

                    <div className="bg-secondary h-4 w-3/5 rounded-md"></div>
                    <div className="bg-secondary h-4 w-3/5 rounded-md"></div>
                    <div className="bg-secondary h-4 w-3/5 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}
