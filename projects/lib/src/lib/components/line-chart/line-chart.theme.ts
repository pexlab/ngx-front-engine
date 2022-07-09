import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZLineChartTheme = z.object(
    {
        line: ZHEXColor
    }
);

export const ZPartialChartTheme = ZLineChartTheme.partial();

export type PartialChartTheme = z.infer<typeof ZPartialChartTheme>;
