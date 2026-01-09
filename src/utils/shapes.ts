import z from 'zod';

export const numberShape = z.union([
    z
        .number()
        .min(0)
        .transform((val) =>
            val === null || isNaN(Number(val)) ? 0 : Number(val),
        ),
    // z
    //     .string()
    //     .transform((val) => (val === '' ? null : val))
    //     .nullable()
    //     .refine((val) => val === null || !isNaN(Number(val)), {
    //         error: 'Número inválido.',
    //     })
    //     .transform((val) => (val === null ? 0 : Number(val))),
    // z.nan().transform(() => undefined),
]);
