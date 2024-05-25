import { Page } from '../shared/Page';
import { NewWorkoutCard } from './NewWorkoutCard';
import { WorkoutList } from './WorkoutList';

export function Home() {
    return (
        <Page>
            <NewWorkoutCard />
            <WorkoutList />
        </Page>
    );
}
