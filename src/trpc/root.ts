import { authRouter } from './routers/auth';
import { exerciseRouter } from './routers/exercise';
import { userRouter } from './routers/user';
import { workoutRouter } from './routers/workout';
import { workoutTemplateRouter } from './routers/workoutTemplate';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    user: userRouter,
    exercise: exerciseRouter,
    workout: workoutRouter,
    workoutTemplate: workoutTemplateRouter,
});

export type AppRouter = typeof appRouter;
