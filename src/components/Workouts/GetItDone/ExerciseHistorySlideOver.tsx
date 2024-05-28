import { ExerciseType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { SlideOver, SlideOverProps } from '~/components/shared/SlideOver';
import { RouterOutputs, api } from '~/utils/api';
import { formatDate } from '~/utils/transforms';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useExercises } from '~/contexts/useExercises';

export function useExerciseHistorySlideOver() {
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

interface WorkoutExerciseHistorySlideOverProps
    extends Omit<SlideOverProps, 'title' | 'children'> {
    exerciseId: string | null;
}

export function WorkoutExerciseHistorySlideOver({
    exerciseId,
    open,
    onClose,
}: WorkoutExerciseHistorySlideOverProps) {
    const { data, isFetching } = api.exercise.history.useQuery(
        { exerciseId: exerciseId ?? '' },
        { enabled: !!exerciseId },
    );

    const { getExerciseById } = useExercises();
    const [exercise, setExercise] = useState({ name: '', isAerobic: false });

    useEffect(() => {
        if (data && data.length > 0) {
            const exerciseInfo = getExerciseById(exerciseId ?? '');
            setExercise({
                name: exerciseInfo?.name ?? '',
                isAerobic: exerciseInfo?.type === ExerciseType.AEROBIC,
            });
        }
    }, [data]);

    const workoutExercises = data ?? [];

    return (
        <SlideOver title="Últimas rútinas" open={open} onClose={onClose}>
            {isFetching && <Shimmer />}

            {!isFetching &&
                (workoutExercises.length > 0 ? (
                    <div>
                        <h2 className="px-2 text-lg font-semibold tracking-tight">
                            {exercise.name}
                        </h2>

                        <div className="mt-2 space-y-1">
                            {workoutExercises.map((workoutExercise) => (
                                <WorkoutExercise
                                    key={workoutExercise.id}
                                    workoutExercise={workoutExercise}
                                    isAerobic={exercise.isAerobic}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
                        <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                            <SparklesIcon className="size-8" />

                            <p className="text-pretty text-center text-sm font-medium">
                                No se han completado rútinas con este
                                ejercicio...
                            </p>
                        </div>
                    </div>
                ))}
        </SlideOver>
    );
}

interface WorkoutExerciseProps {
    workoutExercise: RouterOutputs['exercise']['history'][number];
    isAerobic: boolean;
}

function WorkoutExercise({ isAerobic, workoutExercise }: WorkoutExerciseProps) {
    return (
        <div className="rounded-xl bg-brand-100 px-8 py-4">
            <h3 className="text-lg font-semibold">
                {workoutExercise.workout?.name}
            </h3>

            <div className="text-xs font-semibold text-brand-700">
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
                    <p className="whitespace-pre text-pretty text-xs">
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

            <span className="text-sm text-brand-400">x</span>

            <span>
                <span className="text-base">{distance}</span>
                <span className="text-xs">dist</span>
            </span>

            <span className="text-sm text-brand-400">x</span>

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

            <span className="text-sm text-brand-700">x</span>

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
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={`shimmer-div-${i}`}
                    className="rounded-xl bg-brand-100 p-3"
                >
                    <div className="flex flex-col space-y-2">
                        <div className="h-4 w-1/2 rounded-md bg-brand-300"></div>
                        <div className="h-3 w-3/4 rounded-md bg-brand-400"></div>

                        {/* Spacer */}
                        <div></div>

                        <div className="h-4 w-3/5 rounded-md bg-brand-300"></div>
                        <div className="h-4 w-3/5 rounded-md bg-brand-300"></div>
                        <div className="h-4 w-3/5 rounded-md bg-brand-300"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
