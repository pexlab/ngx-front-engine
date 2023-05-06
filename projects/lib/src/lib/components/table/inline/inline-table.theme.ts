import { z } from 'zod';
import { ZHEXColor } from '../../../interfaces/color.interface';

export const ZInlineTableTheme = z.object(
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
                circle : ZHEXColor,
                stripeA: ZHEXColor,
                stripeB: ZHEXColor
            }
        ),
        outline        : ZHEXColor,
        dragHandle     : ZHEXColor,
        dragHandleHover: ZHEXColor,
        background     : z.object(
            {
                whole   : ZHEXColor,
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

export const ZPartialInlineTableTheme = ZInlineTableTheme.partial();

export type InlineTableTheme = z.infer<typeof ZInlineTableTheme>;
export type PartialInlineTableTheme = z.infer<typeof ZPartialInlineTableTheme>;
