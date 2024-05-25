import { WorkoutStatus } from '@prisma/client';
import { createTRPCRouter, privateProcedure } from '../trpc';

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
                            orderBy: { workout: { completedAt: 'desc' } },
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
});
