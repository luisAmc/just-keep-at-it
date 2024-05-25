import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';

export const workoutTemplateRouter = createTRPCRouter({
    all: privateProcedure.query(async ({ ctx }) => {
        return ctx.db.workoutTemplate.findMany({
            where: {
                userId: ctx.session.userId,
            },
            select: {
                id: true,
                name: true,
                exercises: {
                    select: {
                        id: true,
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
    }),

    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(1),
                exercises: z
                    .array(
                        z.object({
                            exerciseId: z.string(),
                            exerciseIndex: z.number(),
                        }),
                    )
                    .min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.workoutTemplate.create({
                data: {
                    userId: ctx.session.userId,
                    name: input.name,
                    exercises: {
                        createMany: {
                            data: input.exercises.map((exercise) => ({
                                exerciseId: exercise.exerciseId,
                                exerciseIndex: exercise.exerciseIndex,
                            })),
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
        }),

    startFromTemplate: privateProcedure
        .input(z.object({ templateId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const template = await ctx.db.workoutTemplate.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.templateId,
                },
                select: {
                    name: true,
                    exercises: {
                        select: {
                            exerciseId: true,
                            exerciseIndex: true,
                        },
                    },
                },
            });

            return ctx.db.workout.create({
                data: {
                    userId: ctx.session.userId,
                    name: template.name,
                    workoutExercises: {
                        createMany: {
                            data: template.exercises.map((exercise) => ({
                                userId: ctx.session.userId,
                                exerciseId: exercise.exerciseId,
                                exerciseIndex: exercise.exerciseIndex,
                            })),
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
        }),
});
