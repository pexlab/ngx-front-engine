import { z } from 'zod';

export const ZTableTheme = z.object(
    {}
);

export const ZPartialTableTheme = ZTableTheme.partial();

export type TableTheme = z.infer<typeof ZTableTheme>;
export type PartialTableTheme = z.infer<typeof ZPartialTableTheme>;
