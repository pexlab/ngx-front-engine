import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZButtonTheme = z.object(
    {
        text        : ZHEXColor,
        background  : ZHEXColor,
        borderBottom: ZHEXColor,
        hinge       : z.object(
            {
                hoverText      : ZHEXColor,
                hoverBackground: ZHEXColor
            }
        )
    }
);

export const ZPartialButtonTheme = ZButtonTheme.deepPartial();

export type ButtonTheme = z.infer<typeof ZButtonTheme>;
export type PartialButtonTheme = z.infer<typeof ZPartialButtonTheme>;
