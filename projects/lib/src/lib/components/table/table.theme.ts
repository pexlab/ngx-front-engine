import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZTableTheme = z.object(
    {
        text           : ZHEXColor,
        button         : z.object(
            {
                text      : ZHEXColor,
                background: ZHEXColor,
                tooltip   : ZHEXColor
            }
        ),
        loader         : z.object(
            {
                circle: ZHEXColor,
                stripeA: ZHEXColor,
                stripeB: ZHEXColor
            }
        ),
        outline        : ZHEXColor,
        dragHandle     : ZHEXColor,
        dragHandleHover: ZHEXColor,
        background     : z.object(
            {
                header  : ZHEXColor,
                rowEven : ZHEXColor,
                rowOdd  : ZHEXColor,
                rowHover: ZHEXColor
            }
        ),
        highlight      : z.object(
            {
                header : ZHEXColor,
                cell   : ZHEXColor,
                outline: ZHEXColor
            }
        )
    }
);

export const ZPartialTableTheme = ZTableTheme.partial();

export type TableTheme = z.infer<typeof ZTableTheme>;
export type PartialTableTheme = z.infer<typeof ZPartialTableTheme>;
