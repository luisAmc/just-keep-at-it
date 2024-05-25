import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { authenticateUser } from '~/utils/auth';
import { createSession, removeSession } from '~/utils/sessions';

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(
            z.object({
                username: z.string().min(1),
                password: z.string().min(1)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await authenticateUser(input.username, input.password);

            await createSession(ctx.ironSession, user);

            return {
                id: user.id,
                username: user.username
            };
        }),

    logout: privateProcedure.mutation(async ({ ctx }) => {
        await removeSession(ctx.ironSession, ctx.session);
        return { success: true };
    })
});
