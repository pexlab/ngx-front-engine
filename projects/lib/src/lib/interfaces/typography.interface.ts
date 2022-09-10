import { z } from 'zod';

export const ZFont = z.object(
    {
        name  : z.string(),
        size  : z.string(),
        weight: z.number().positive()
    }
);

export type Font = z.infer<typeof ZFont>;

export type Typography = { [ key: string ]: Font };
