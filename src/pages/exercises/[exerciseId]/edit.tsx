import { GetServerSideProps } from 'next';
import { query } from 'src/components/Exercises/EditExercise';
import { preloadQuery } from 'src/utils/apollo';
import { authenticatedRoute } from 'src/utils/redirects';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = authenticatedRoute(ctx);
  if ('redirect' in auth) {
    return auth;
  }

  return preloadQuery(ctx, {
    query,
    variables: { id: ctx.params!.exerciseId }
  });
};

export { EditExercise as default } from 'src/components/Exercises/EditExercise';
