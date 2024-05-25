import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export function ViewWorkout() {
    const router = useRouter();

    const { data, isLoading } = api.workout.byId.useQuery({
        workoutId: router.query.workoutId as string,
    });

    return <div>ViewWorkout</div>;
}
