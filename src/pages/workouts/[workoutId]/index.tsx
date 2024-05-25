import { GetServerSideProps } from 'next';
import { authenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { ViewWorkout as default } from '~/components/Workouts/ViewWorkout';
