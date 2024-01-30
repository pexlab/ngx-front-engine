import { z } from 'zod';
import { ZHexColor } from '../../../interfaces/color.interface';

export const ZInlineTableTheme = z.object(
    {
        text           : ZHexColor,
        button         : z.object(
            {
                text      : ZHexColor,
                background: ZHexColor,
                tooltip   : ZHexColor
            }
        ),
        loader         : z.object(
            {
                circle : ZHexColor,
                stripeA: ZHexColor,
                stripeB: ZHexColor
            }
        ),
        outline        : ZHexColor,
        dragHandle     : ZHexColor,
        dragHandleHover: ZHexColor,
        background     : z.object(
            {
                whole   : ZHexColor,
                header  : ZHexColor,
                rowEven : ZHexColor,
                rowOdd  : ZHexColor,
                rowHover: ZHexColor
            }
        ),
        highlight      : z.object(
            {
                header : ZHexColor,
                cell   : ZHexColor,
                outline: ZHexColor
            }
        )
    }
);

export const ZPartialInlineTableTheme = ZInlineTableTheme.partial();

export type InlineTableTheme = z.infer<typeof ZInlineTableTheme>;
export type PartialInlineTableTheme = z.infer<typeof ZPartialInlineTableTheme>;
