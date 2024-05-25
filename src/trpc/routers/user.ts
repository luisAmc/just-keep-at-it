import { createTRPCRouter, privateProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
    viewer: privateProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findUniqueOrThrow({
            where: {
                id: ctx.session.userId
            },
            select: {
                username: true
            }
        });
    })
});
