import { api } from '~/utils/api';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Form, useZodForm } from '../shared/Form';
import { Input } from '../shared/Input';
import { SubmitButton } from '../shared/SubmitButton';
import { useAuthRedirect } from '~/utils/useAuthRedirect';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

const loginSchema = z.object({
    username: z.string().min(1, 'Ingrese su usuario.'),
    password: z
        .string()
        .min(6, 'El tamaño mínimo de la contraseña es seis caracteres.'),
});

export function LoginForm() {
    const authRedirect = useAuthRedirect();

    const form = useZodForm({ schema: loginSchema });

    const login = api.auth.login.useMutation({
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
                            src="/images/login.webp"
                            width={222}
                            height={250}
                            alt="login illustration"
                        />
                    </div>

                    <div className="pb-6"></div>

                    <Form
                        form={form}
                        onSubmit={(input) =>
                            login.mutateAsync({
                                username: input.username,
                                password: input.password,
                            })
                        }
                    >
                        <ErrorMessage
                            title="Error de ingreso"
                            error={login.error?.message}
                        />

                        <Input
                            {...form.register('username')}
                            autoFocus
                            autoCapitalize="off"
                            placeholder="Usuario"
                        />

                        <Input
                            {...form.register('password')}
                            type="password"
                            placeholder="Contraseña"
                        />

                        <SubmitButton>Ingresar</SubmitButton>
                    </Form>

                    <div className="mt-4 flex justify-end">
                        <Link href="/auth/signup">Crear cuenta</Link>
                    </div>

                    {/* <p className="mt-4 text-center text-xs font-medium">
                        Illustration by{' '}
                        <a href="https://icons8.com/illustrations/author/HzkZD6h9f9qm">
                            AsIa Vitalyevna
                        </a>{' '}
                        from{' '}
                        <a href="https://icons8.com/illustrations">Ouch!</a>
                    </p> */}
                </div>
            </div>
        </div>
    );
}
