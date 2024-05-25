import { GetServerSideProps } from 'next';
import { authenticatedRoute } from '~/utils/redirects';

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export { Templates as default } from '~/components/Templates';
