import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutProvider } from './useWorkout';
import { WorkoutExercises } from './WorkoutExercises';
import { Form, useZodForm } from '~/components/shared/Form';
import { z } from 'zod';
import { Page } from '~/components/shared/Page';
import { SubmitButton } from '~/components/shared/SubmitButton';

const getItDoneSchema = z.object({
    workoutExercises: z.array(
        z.object({
            exerciseId: z.string(),
            sets: z.array(
                z.object({
                    index: z.string().optional(),
                    mins: z.string().optional(),
                    distance: z.string().optional(),
                    kcal: z.string().optional(),
                    reps: z.string().optional(),
                    lbs: z.string().optional(),
                }),
            ),
        }),
    ),
});

export function GetItDone() {
    const router = useRouter();

    const { data, isLoading } = api.workout.byId.useQuery({
        workoutId: router.query.workoutId as string,
    });

    const form = useZodForm({ schema: getItDoneSchema });

    return (
        <Page>
            {isLoading && <div>Cargando...</div>}

            {data && (
                <WorkoutProvider workout={data}>
                    <Form
                        form={form}
                        onSubmit={(input) => {
                            console.log({ input });
                        }}
                    >
                        <div className="space-y-4 rounded-xl bg-brand-50 p-4">
                            <WorkoutHeader />
                            <WorkoutExercises />

                            <SubmitButton className="w-full">
                                Finalizar
                            </SubmitButton>
                        </div>
                    </Form>
                </WorkoutProvider>
            )}
        </Page>
    );
}
