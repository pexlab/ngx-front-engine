import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZCommentTheme = z.object(
    {
        text      : ZHexColor,
        date      : ZHexColor,
        iconIdle  : ZHexColor,
        badge     : ZHexColor,
        border    : ZHexColor,
        background: ZHexColor
    }
);

export const ZPartialCommentTheme = ZCommentTheme.partial();

export type ICommentTheme = z.infer<typeof ZCommentTheme>;
export type IPartialCommentTheme = z.infer<typeof ZPartialCommentTheme>;
