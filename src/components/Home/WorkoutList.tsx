import { SparklesIcon } from '@heroicons/react/24/outline';
import { RouterOutputs, api } from '~/utils/api';
import { InfiniteList } from '../shared/InfiniteList';
import { cn } from '~/utils/cn';
import { WorkoutStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function WorkoutList() {
    const { data, isLoading, fetchNextPage, hasNextPage } =
        api.workout.infinite.useInfiniteQuery(
            {},
            { getNextPageParam: (lastPage) => lastPage.nextCursor },
        );

    const workouts = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <div className="mt-4">
            <h2 className="mb-2 text-3xl font-medium">Últimas rútinas</h2>

            {isLoading && <div>Cargando</div>}

            {!isLoading &&
                (workouts.length === 0 ? (
                    <EmptyWorkouts />
                ) : (
                    <InfiniteList
                        length={workouts.length}
                        hasNext={!!hasNextPage}
                        next={fetchNextPage}
                    >
                        {workouts.map((workout) => (
                            <WorkoutCard key={workout.id} workout={workout} />
                        ))}
                    </InfiniteList>
                ))}
        </div>
    );
}

interface WorkoutCardProps {
    workout: RouterOutputs['workout']['infinite']['items'][number];
}

function WorkoutCard({ workout }: WorkoutCardProps) {
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
                    'w-full rounded-xl border p-4 text-start shadow-sm',
                    workout.status === WorkoutStatus.DRAFTED
                        ? 'bg-white'
                        : 'bg-brand-100',
                )}
            >
                <h3 className="text-lg font-medium">{workout.name}</h3>

                {workout.workoutExercises.map(({ id, exercise }, idx) => (
                    <div key={id} className="space-x-1.5">
                        <span className="text-xs font-medium">{idx + 1}.</span>
                        <span className="text-sm">{exercise.name}</span>
                    </div>
                ))}
            </div>
        </Link>
    );
}

function EmptyWorkouts() {
    return (
        <div className="flex flex-col items-center space-y-2 rounded-md bg-brand-100 p-8 text-brand-700">
            <SparklesIcon className="h-10 w-10" />
            <p className="text-sm font-semibold">No se han creado rutinas...</p>
        </div>
    );
}
