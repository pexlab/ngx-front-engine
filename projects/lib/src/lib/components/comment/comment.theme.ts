import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZCommentTheme = z.object(
    {
        text      : ZHEXColor,
        date      : ZHEXColor,
        iconIdle  : ZHEXColor,
        badge     : ZHEXColor,
        border    : ZHEXColor,
        background: ZHEXColor
    }
);

export const ZPartialCommentTheme = ZCommentTheme.partial();

export type ICommentTheme = z.infer<typeof ZCommentTheme>;
export type IPartialCommentTheme = z.infer<typeof ZPartialCommentTheme>;
