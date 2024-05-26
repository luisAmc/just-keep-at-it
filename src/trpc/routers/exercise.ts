import { WorkoutStatus } from '@prisma/client';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { z } from 'zod';

export const exerciseRouter = createTRPCRouter({
    allByCategory: privateProcedure.query(async ({ ctx }) => {
        const categories = await ctx.db.exerciseCategory.findMany({
            where: {
                userId: ctx.session.userId,
            },
            select: {
                id: true,
                name: true,
                type: true,
                exercises: {
                    select: {
                        id: true,
                        name: true,
                        workoutExercises: {
                            select: {
                                id: true,
                                notes: true,
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
                            where: {
                                workout: {
                                    status: { equals: WorkoutStatus.DONE },
                                },
                            },
                            orderBy: { completedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
        });

        const exercisesByCategory = categories.map((category) => ({
            id: category.id,
            name: category.name,
            type: category.type,
            exercises: category.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                lastSession: exercise.workoutExercises[0],
                type: category.type,
                categoryName: category.name,
            })),
        }));

        return exercisesByCategory;
    }),

    create: privateProcedure
        .input(
            z.object({
                name: z.string().min(1),
                categoryId: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const category = await ctx.db.exerciseCategory.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.categoryId,
                },
                select: {
                    id: true,
                },
            });

            return ctx.db.exercise.create({
                data: {
                    userId: ctx.session.userId,
                    categoryId: category.id,
                    name: input.name,
                },
                select: {
                    id: true,
                },
            });
        }),

    editName: privateProcedure
        .input(
            z.object({
                exerciseId: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const exercise = await ctx.db.exercise.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.exerciseId,
                },
                select: {
                    id: true,
                },
            });

            return await ctx.db.exercise.update({
                where: {
                    id: exercise.id,
                },
                data: {
                    name: input.name,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        }),
});
