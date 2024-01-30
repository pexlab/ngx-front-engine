import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZButtonTheme = z.object(
    {
        text        : ZHexColor,
        background  : ZHexColor,
        borderBottom: ZHexColor,
        hinge       : z.object(
            {
                hoverText      : ZHexColor,
                hoverBackground: ZHexColor
            }
        ),
        circle      : z.object(
            {
                tooltipText: ZHexColor
            }
        )
    }
);

export const ZPartialButtonTheme = ZButtonTheme.deepPartial();

export type ButtonTheme = z.infer<typeof ZButtonTheme>;
export type PartialButtonTheme = z.infer<typeof ZPartialButtonTheme>;
