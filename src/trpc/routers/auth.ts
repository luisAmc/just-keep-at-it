import { z } from 'zod';
import { createTRPCRouter, privateProcedure, publicProcedure } from '../trpc';
import { authenticateUser, hashPassword } from '~/utils/auth';
import { createSession, removeSession } from '~/utils/sessions';
import { ExerciseType } from '@prisma/client';

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(
            z.object({
                username: z.string().min(1),
                password: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const user = await authenticateUser(input.username, input.password);

            await createSession(ctx.ironSession, user);

            return {
                id: user.id,
                username: user.username,
            };
        }),

    logout: privateProcedure.mutation(async ({ ctx }) => {
        await removeSession(ctx.ironSession, ctx.session);
        return { success: true };
    }),

    signUp: publicProcedure
        .input(
            z.object({
                username: z.string().min(1),
                password: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const isUsernameAlreadyTaken = await ctx.db.user.findUnique({
                where: { username: input.username },
                select: { id: true },
            });

            if (isUsernameAlreadyTaken) {
                throw new Error('El nombre de usuario ya está en uso.');
            }

            const newUser = await ctx.db.user.create({
                data: {
                    username: input.username,
                    hashedPassword: await hashPassword(input.password),
                },
            });

            for (const category of SEED_CATEGORIES) {
                await ctx.db.exerciseCategory.upsert({
                    where: {
                        userId_name: {
                            userId: newUser.id,
                            name: category.name,
                        },
                    },
                    create: {
                        userId: newUser.id,
                        name: category.name,
                        type: category.type,
                        exercises: {
                            createMany: {
                                data: category.exercises.map(
                                    (exerciseName) => ({
                                        userId: newUser.id,
                                        name: exerciseName,
                                    }),
                                ),
                            },
                        },
                    },
                    update: {},
                });
            }

            await createSession(ctx.ironSession, newUser);

            return {
                id: newUser.id,
                username: newUser.username,
            };
        }),
});

const SEED_CATEGORIES = [
    {
        name: 'Aerobics',
        type: ExerciseType.AEROBIC,
        exercises: ['Treadmill', 'Cycling'],
    },
    {
        name: 'Arms',
        type: ExerciseType.STRENGTH,
        exercises: [
            'Bicep Curl (Dumbell)',
            'Preacher Curl (Barbell)',
            'Preacher Curl (Machine)',
            'Single Arm Preacher Curl',
            'Tricep Extension (Cable)',
            'Tricep Extension (Machine)',
        ],
    },
    {
        name: 'Shoulders',
        type: ExerciseType.STRENGTH,
        exercises: [
            'Shoulder Press',
            'Lateral Raises (Machine)',
            'Rear Delt Fly',
            'Standing Row',
        ],
    },
    {
        name: 'Chest',
        type: ExerciseType.STRENGTH,
        exercises: [
            'Bench Press (Machine)',
            'Incline Bench Press (Machine)',
            'Decline Cable Press',
        ],
    },
    {
        name: 'Back',
        type: ExerciseType.STRENGTH,
        exercises: [
            'Seated Row',
            'Seated Row (Unilateral)',
            'Lat Pulldown',
            'Front Pulldown',
        ],
    },
    {
        name: 'Legs',
        type: ExerciseType.STRENGTH,
        exercises: [
            'Leg Press',
            'Leg Extensions',
            'Hamstring Curls',
            'Adductors (Close)',
            'Abductors (Open)',
            'Calf Extensions',
            'Kick Backs',
        ],
    },
];
