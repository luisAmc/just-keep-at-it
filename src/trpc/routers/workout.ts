import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';

export const workoutRouter = createTRPCRouter({
    infinite: privateProcedure
        .input(
            z.object({
                limit: z.number().default(1),
                cursor: z.string().nullish(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const workouts = await ctx.db.workout.findMany({
                take: input.limit + 1,
                where: {
                    userId: ctx.session.userId,
                },
                cursor: input.cursor ? { id: input.cursor } : undefined,
                orderBy: {
                    id: 'desc',
                },
                select: {
                    id: true,
                    name: true,
                    completedAt: true,
                    createdAt: true,
                    status: true,
                    workoutExercises: {
                        select: {
                            id: true,
                            exerciseIndex: true,
                            sets: {
                                select: {
                                    id: true,
                                },
                            },
                            exercise: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            let nextCursor: typeof input.cursor | undefined = undefined;

            if (workouts.length > input.limit) {
                const nextItem = workouts.pop();
                nextCursor = nextItem!.id;
            }
            return {
                items: workouts,
                nextCursor,
            };
        }),

    byId: privateProcedure
        .input(z.object({ workoutId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            return ctx.db.workout.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    completedAt: true,
                    workoutExercises: {
                        select: {
                            id: true,
                            exerciseIndex: true,
                            exercise: {
                                select: {
                                    id: true,
                                    name: true,
                                    category: {
                                        select: {
                                            type: true,
                                        },
                                    },
                                },
                            },
                            sets: {
                                select: {
                                    id: true,
                                    mins: true,
                                    distance: true,
                                    kcal: true,
                                    lbs: true,
                                    reps: true,
                                },
                            },
                        },
                    },
                },
            });
        }),

    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.workout.create({
                data: {
                    userId: ctx.session.userId,
                    name: input.name,
                },
                select: {
                    id: true,
                },
            });
        }),

    delete: privateProcedure
        .input(z.object({ workoutId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const workout = await ctx.db.workout.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                include: {
                    workoutExercises: {
                        include: {
                            sets: true,
                        },
                    },
                },
            });

            await ctx.db.workoutSet.deleteMany({
                where: {
                    workoutExerciseId: {
                        in: workout.workoutExercises.map(
                            (workoutExercise) => workoutExercise.id,
                        ),
                    },
                },
            });

            await ctx.db.workoutExercise.deleteMany({
                where: {
                    workoutId: workout.id,
                },
            });

            return ctx.db.workout.delete({
                where: {
                    id: input.workoutId,
                },
                select: {
                    id: true,
                },
            });
        }),
});
