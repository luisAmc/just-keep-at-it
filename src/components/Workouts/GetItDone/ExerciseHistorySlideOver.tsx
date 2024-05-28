import { ExerciseType } from '@prisma/client';
import { useState } from 'react';
import { SlideOver, SlideOverProps } from '~/components/shared/SlideOver';
import { api } from '~/utils/api';
import { formatDate } from '~/utils/transforms';

export function useExerciseHistorySlideOver() {
    const [_exerciseId, setExerciseId] = useState<string | null>(null);

    return {
        open: (exerciseId: string) => {
            setExerciseId(exerciseId);
        },
        close: () => setExerciseId(null),
        props: {
            exerciseId: _exerciseId,
            open: _exerciseId !== null,
            onClose() {
                setExerciseId(null);
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

    const workoutExercises = data ?? [];

    const isAerobic = data
        ? workoutExercises[0].exercise.category.type === ExerciseType.AEROBIC
        : false;

    return (
        <SlideOver title="Últimas rútinas" open={open} onClose={onClose}>
            {isFetching && <Shimmer />}

            {!isFetching && workoutExercises && (
                <div className="space-y-1">
                    {workoutExercises.map((workoutExercise) => (
                        <div
                            key={workoutExercise.id}
                            className="rounded-xl bg-brand-100 px-8 py-4"
                        >
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
                                                <>
                                                    <span>
                                                        <span className="text-base">
                                                            {set.mins}
                                                        </span>
                                                        <span className="text-xs">
                                                            mins
                                                        </span>
                                                    </span>

                                                    <span className="text-sm text-brand-400">
                                                        x
                                                    </span>

                                                    <span>
                                                        <span className="text-base">
                                                            {set.distance}
                                                        </span>
                                                        <span className="text-xs">
                                                            dist
                                                        </span>
                                                    </span>

                                                    <span className="text-sm text-brand-400">
                                                        x
                                                    </span>

                                                    <span>
                                                        <span className="text-base">
                                                            {set.kcal}
                                                        </span>
                                                        <span className="text-xs">
                                                            kcal
                                                        </span>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        <span className="text-base">
                                                            {set.lbs}
                                                        </span>
                                                        <span className="text-xs">
                                                            lbs
                                                        </span>
                                                    </span>

                                                    <span className="text-sm text-brand-700">
                                                        x
                                                    </span>

                                                    <span>
                                                        <span className="text-base">
                                                            {set.reps}
                                                        </span>
                                                        <span className="text-xs">
                                                            reps
                                                        </span>
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {workoutExercise.notes && (
                                <div className="mt-2">
                                    <div className="text-xs font-bold">
                                        Notas:
                                    </div>
                                    <p className="whitespace-pre text-pretty text-xs">
                                        {workoutExercise.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </SlideOver>
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
