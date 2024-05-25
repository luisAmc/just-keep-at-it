import { GetServerSideProps } from 'next';
import { authenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { GetItDone as default } from '~/components/Workouts/GetItDone';
