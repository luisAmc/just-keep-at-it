import { cn } from '~/utils/cn';
import { formatDate } from '~/utils/transforms';
import { InfiniteList } from '../shared/InfiniteList';
import { RouterOutputs, api } from '~/utils/api';
import { WorkoutStatus } from '@prisma/client';
import Link from 'next/link';
import { CatIcon } from 'lucide-react';
import { usePersistedLocalStorage } from '~/utils/usePersistedLocalStorage';
import { useExercises } from '~/contexts/useExercises';

export function WorkoutList() {
    const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
        api.workout.infinite.useInfiniteQuery(
            {},
            { getNextPageParam: (lastPage) => lastPage.nextCursor },
        );

    const workouts = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <div className="mt-4">
            <h2 className="mb-2 text-3xl font-medium">Últimas rútinas</h2>

            {isLoading && <Shimmer />}

            {!isLoading &&
                (workouts.length === 0 ? (
                    <EmptyWorkouts />
                ) : (
                    <div
                        className={cn(
                            'flex flex-col gap-y-2',
                            isFetching && 'animate-pulse',
                        )}
                    >
                        <InfiniteList
                            length={workouts.length}
                            hasNext={!!hasNextPage}
                            next={fetchNextPage}
                        >
                            {workouts.map((workout) => (
                                <WorkoutCard
                                    key={workout.id}
                                    workout={workout}
                                />
                            ))}
                        </InfiniteList>
                    </div>
                ))}
        </div>
    );
}

interface WorkoutCardProps {
    workout: RouterOutputs['workout']['infinite']['items'][number];
}

function WorkoutCard({ workout }: WorkoutCardProps) {
    const isDone = workout.status === WorkoutStatus.DONE;

    const { getExerciseById } = useExercises();
    const persistedLocalStorage = usePersistedLocalStorage();
    const persistedData = persistedLocalStorage.get(workout.id);

    const hasLocalData = !!persistedData.workoutExercises;

    return (
        <Link
            href={
                workout.status === WorkoutStatus.DRAFTED
                    ? `/workouts/${workout.id}/get-it-done`
                    : `/workouts/${workout.id}`
            }
        >
            <div
                className={cn(
                    'w-full rounded-lg border border-brand-500 p-4 text-start shadow-sm',
                    workout.status === WorkoutStatus.DRAFTED
                        ? 'border-2 border-dashed bg-brand-100'
                        : 'bg-brand-200',
                )}
            >
                <h3 className="text-lg font-medium">{workout.name}</h3>

                <span className="itmes-center flex gap-x-1 text-xs">
                    <span>{isDone ? 'Finalizado el' : 'Creado el'}</span>
                    <span className="font-medium capitalize">
                        {formatDate(
                            isDone ? workout.completedAt! : workout.createdAt,
                            'EEEE, dd MMM h:mm aaaa',
                        )}
                    </span>
                </span>

                <div className="mt-2">
                    {hasLocalData
                        ? persistedData.workoutExercises.map(
                              ({ exerciseIndex, exerciseId }) => {
                                  const exercise = getExerciseById(exerciseId);

                                  return (
                                      <div
                                          key={exerciseIndex}
                                          className="space-x-1.5"
                                      >
                                          <span className="text-xs font-medium">
                                              {exerciseIndex + 1}.
                                          </span>
                                          <span className="text-sm">
                                              {exercise!.name}
                                          </span>
                                      </div>
                                  );
                              },
                          )
                        : workout.workoutExercises.map(
                              ({ id, exercise }, idx) => (
                                  <div key={id} className="space-x-1.5">
                                      <span className="text-xs font-medium">
                                          {idx + 1}.
                                      </span>
                                      <span className="text-sm">
                                          {exercise.name}
                                      </span>
                                  </div>
                              ),
                          )}
                </div>
            </div>
        </Link>
    );
}

function EmptyWorkouts() {
    return (
        <div className="flex flex-col items-center space-y-2 rounded-md bg-brand-100 p-8 text-brand-700">
            <CatIcon className="h-10 w-10" />
            <p className="text-sm font-semibold">No se han creado rutinas...</p>
        </div>
    );
}

function Shimmer() {
    return (
        <div className="flex animate-pulse flex-col space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={`shimmer-div-${i}`}
                    className="rounded-lg bg-brand-200 px-5 py-4"
                >
                    <div className="flex flex-col space-y-2">
                        <div className="mb-2 flex flex-col gap-y-1">
                            <div className="h-4 w-40 rounded-md bg-brand-400"></div>
                            <div className="h-3 w-20 rounded-md bg-brand-400"></div>
                        </div>

                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                        <div className="h-3 w-52 rounded-md bg-brand-400"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
