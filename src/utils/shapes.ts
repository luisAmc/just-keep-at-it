import z from 'zod';

export const numberShape = z.union([
    z.number().min(0),
    z.nan().transform(() => undefined),
]);
