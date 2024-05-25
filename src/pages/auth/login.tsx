import { GetServerSideProps } from 'next';
import { unauthenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { LoginForm as default } from '~/components/Auth/LoginForm';
