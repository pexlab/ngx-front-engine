import { z } from 'zod';

export const ZBookTheme = z.object(
    {}
);

export const ZPartialBookTheme = ZBookTheme.partial();

export type BookTheme = z.infer<typeof ZBookTheme>;
export type PartialBookTheme = z.infer<typeof ZPartialBookTheme>;
