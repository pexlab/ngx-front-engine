import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZSpeedometerTheme = z.object(
    {
        hud       : ZHEXColor,
        border    : z.object(
            {
                inner: ZHEXColor,
                outer: ZHEXColor
            }
        ),
        indicator : z.object(
            {
                gradientStart: ZHEXColor,
                gradientEnd  : ZHEXColor
            }
        ),
        step      : z.object(
            {
                primary  : ZHEXColor,
                secondary: ZHEXColor
            }
        ),
        marker    : ZHEXColor,
        background: z.object(
            {
                inner: ZHEXColor,
                outer: ZHEXColor
            }
        )
    }
);

export const ZPartialSpeedometerTheme = ZSpeedometerTheme.partial();

export type SpeedometerTheme = z.infer<typeof ZSpeedometerTheme>;
export type PartialSpeedometerTheme = z.infer<typeof ZPartialSpeedometerTheme>;
