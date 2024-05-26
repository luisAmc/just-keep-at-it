import { GetServerSideProps } from 'next';
import { unauthenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export { SignUpForm as default } from '~/components/Auth/SignUpForm';
