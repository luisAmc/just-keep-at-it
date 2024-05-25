import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../trpc';
import { WorkoutStatus } from '@prisma/client';
import { ValidationError } from '../errors';

const getItDoneInput = z.object({
    workoutId: z.string().min(1),
    workoutExercises: z.array(
        z.object({
            exerciseId: z.string().min(1),
            exerciseIndex: z.number(),
            sets: z.array(
                z.object({
                    mins: z.number().optional(),
                    distance: z.number().optional(),
                    kcal: z.number().optional(),
                    reps: z.number().optional(),
                    lbs: z.number().optional(),
                }),
            ),
        }),
    ),
});

export const workoutRouter = createTRPCRouter({
    infinite: privateProcedure
        .input(
            z.object({
                limit: z.number().default(5),
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
                    createdAt: 'desc',
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
                        orderBy: {
                            exerciseIndex: 'asc',
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
                                orderBy: {
                                    setIndex: 'asc',
                                },
                            },
                        },
                        orderBy: {
                            exerciseIndex: 'asc',
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

    partialSave: privateProcedure
        .input(getItDoneInput)
        .mutation(async ({ ctx, input }) => {
            const workout = await ctx.db.workout.findUniqueOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                select: {
                    id: true,
                    status: true,
                },
            });

            if (workout.status === WorkoutStatus.DONE) {
                return false;
            }

            const workoutExercisesIds = await ctx.db.workoutExercise.findMany({
                where: { workoutId: workout.id },
                select: { id: true },
            });

            const partialSave = await ctx.db.$transaction(async (db) => {
                await ctx.db.workoutSet.deleteMany({
                    where: {
                        workoutExerciseId: {
                            in: workoutExercisesIds.map((we) => we.id),
                        },
                    },
                });

                await ctx.db.workoutExercise.deleteMany({
                    where: { workoutId: workout.id },
                });

                for (const workoutExercise of input.workoutExercises) {
                    await ctx.db.workoutExercise.create({
                        data: {
                            userId: ctx.session.userId,
                            workoutId: workout.id,
                            exerciseId: workoutExercise.exerciseId,
                            exerciseIndex: workoutExercise.exerciseIndex,
                            sets: {
                                createMany: {
                                    data: workoutExercise.sets.map(
                                        (set, setIdx) => ({
                                            setIndex: setIdx,
                                            mins: set.mins,
                                            distance: set.distance,
                                            kcal: set.kcal,
                                            lbs: set.lbs,
                                            reps: set.reps,
                                        }),
                                    ),
                                },
                            },
                        },
                    });
                }

                return true;
            });

            return partialSave;
        }),

    getItDone: privateProcedure
        .input(getItDoneInput)
        .mutation(async ({ ctx, input }) => {
            const workout = await ctx.db.workout.findUniqueOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                select: {
                    id: true,
                    status: true,
                },
            });

            if (workout.status === WorkoutStatus.DONE) {
                throw new ValidationError(
                    'La rútina ya habia sido completada anteriormente.',
                    {
                        workoutId: workout.id,
                    },
                );
            }

            const workoutExercisesIds = await ctx.db.workoutExercise.findMany({
                where: { workoutId: workout.id },
                select: { id: true },
            });

            const completedWorkout = await ctx.db.$transaction(async (db) => {
                await ctx.db.workoutSet.deleteMany({
                    where: {
                        workoutExerciseId: {
                            in: workoutExercisesIds.map((we) => we.id),
                        },
                    },
                });

                await ctx.db.workoutExercise.deleteMany({
                    where: { workoutId: workout.id },
                });

                for (const workoutExercise of input.workoutExercises) {
                    await ctx.db.workoutExercise.create({
                        data: {
                            userId: ctx.session.userId,
                            workoutId: workout.id,
                            exerciseId: workoutExercise.exerciseId,
                            exerciseIndex: workoutExercise.exerciseIndex,
                            completedAt: new Date(),
                            sets: {
                                createMany: {
                                    data: workoutExercise.sets.map(
                                        (set, setIdx) => ({
                                            setIndex: setIdx,
                                            mins: set.mins,
                                            distance: set.distance,
                                            kcal: set.kcal,
                                            lbs: set.lbs,
                                            reps: set.reps,
                                        }),
                                    ),
                                },
                            },
                        },
                    });
                }

                return ctx.db.workout.update({
                    where: {
                        userId: ctx.session.userId,
                        id: input.workoutId,
                    },
                    data: {
                        status: WorkoutStatus.DONE,
                        completedAt: new Date(),
                    },
                    select: {
                        id: true,
                    },
                });
            });

            return completedWorkout;
        }),

    doItAgain: privateProcedure
        .input(z.object({ workoutId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const workoutToCopy = await ctx.db.workout.findUniqueOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                include: {
                    workoutExercises: {
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
                    name: workoutToCopy.name,
                    workoutExercises: {
                        createMany: {
                            data: workoutToCopy.workoutExercises.map(
                                (workoutExercise) => ({
                                    userId: ctx.session.userId,
                                    exerciseId: workoutExercise.exerciseId,
                                    exerciseIndex:
                                        workoutExercise.exerciseIndex,
                                }),
                            ),
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
        }),

    editName: privateProcedure
        .input(
            z.object({
                workoutId: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const workout = await ctx.db.workout.findFirstOrThrow({
                where: {
                    userId: ctx.session.userId,
                    id: input.workoutId,
                },
                select: {
                    id: true,
                },
            });

            return await ctx.db.workout.update({
                where: {
                    id: workout.id,
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
