import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZSpeedometerTheme = z.object(
    {
        hud       : ZHexColor,
        border    : z.object(
            {
                inner: ZHexColor,
                outer: ZHexColor
            }
        ),
        indicator : z.object(
            {
                gradientStart: ZHexColor,
                gradientEnd  : ZHexColor
            }
        ),
        step      : z.object(
            {
                primary  : ZHexColor,
                secondary: ZHexColor,
            }
        ),
        marker    : z.object(
            {
                stroke: ZHexColor,
                fill  : ZHexColor,
                intermediate: ZHexColor
            }
        ),
        text      : z.object(
            {
                inner: ZHexColor,
                outer: ZHexColor,
                outerShade: ZHexColor,
                hud  : ZHexColor
            }
        ),
        background: z.object(
            {
                inner: ZHexColor,
                outer: ZHexColor
            }
        )
    }
);

export const ZPartialSpeedometerTheme = ZSpeedometerTheme.partial();

export type SpeedometerTheme = z.infer<typeof ZSpeedometerTheme>;
export type PartialSpeedometerTheme = z.infer<typeof ZPartialSpeedometerTheme>;
