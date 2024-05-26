import { useAuthRedirect } from '~/utils/useAuthRedirect';
import { Form, useZodForm } from '../shared/Form';
import { api } from '~/utils/api';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { z } from 'zod';
import Image from 'next/image';

const signUpSchema = z
    .object({
        username: z.string().min(1, 'Ingrese su usuario.'),
        password: z
            .string()
            .min(6, 'El tamaño mínimo de la contraseña es seis caracteres.'),
        confirmPassword: z
            .string()
            .min(6, 'El tamaño mínimo de la contraseña es seis caracteres.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden.',
        path: ['confirmPassword'],
    });

export function SignUpForm() {
    const authRedirect = useAuthRedirect();

    const form = useZodForm({ schema: signUpSchema });

    const signUp = api.auth.signUp.useMutation({
        onSuccess() {
            authRedirect();
        },
        onError() {
            form.reset(form.getValues());
        },
    });

    return (
        <div className="mx-2 mt-4 flex flex-1 items-center justify-center p-4 sm:mt-6">
            <div className="relative mx-auto w-full max-w-md">
                <div className="relative h-full rounded-xl">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/images/signup.webp"
                            width={222}
                            height={250}
                            alt="login illustration"
                        />
                    </div>

                    <h1 className="mb-4 text-3xl font-medium">Crear cuenta</h1>

                    <Form
                        form={form}
                        onSubmit={(input) =>
                            signUp.mutateAsync({
                                username: input.username,
                                password: input.password,
                            })
                        }
                    >
                        <ErrorMessage
                            title="Error de creación"
                            error={signUp.error?.message}
                        />

                        <Input
                            {...form.register('username')}
                            label="Usuario"
                            autoFocus
                            autoCapitalize="off"
                        />

                        <Input
                            {...form.register('password')}
                            label="Contraseña"
                            type="password"
                        />

                        <Input
                            {...form.register('confirmPassword')}
                            label="Confirmar contraseña"
                            type="password"
                        />

                        <SubmitButton>Crear</SubmitButton>
                    </Form>
                </div>
            </div>
        </div>
    );
}
