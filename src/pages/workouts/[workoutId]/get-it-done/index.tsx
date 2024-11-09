import { appRouter } from '~/trpc/root';
import { authenticatedRoute } from '~/utils/redirects';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { db } from '~/utils/prisma';
import { GetServerSideProps } from 'next';
import { resolveSession } from '~/utils/sessions';
import SuperJSON from 'superjson';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const auth = await authenticatedRoute(context);
    if ('redirect' in auth) {
        return auth;
    }

    const session = await resolveSession(context.req, context.res);

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db: db,
            ironSession: session.ironSession,
            session: session.session,
        },
        transformer: SuperJSON,
    });

    const workoutId = context.query.workoutId as string;
    await helpers.workout.byId.prefetch({ workoutId: workoutId });

    return {
        props: {
            trpcState: helpers.dehydrate(),
            workoutId: workoutId,
            ...(auth as { props: any }).props,
        },
    };
};

export { GetItDone as default } from '~/components/Workouts/GetItDone';
