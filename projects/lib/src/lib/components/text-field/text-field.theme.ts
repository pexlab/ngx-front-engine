import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZTextFieldStateTheme        = z.object(
    {
        text             : ZHexColor,
        border           : ZHexColor,
        divider          : ZHexColor,
        background       : ZHexColor,
        staticPlaceholder: ZHexColor,
        pinnedPlaceholder: ZHexColor,
        icon             : ZHexColor,
        iconBackground   : ZHexColor
    }
);
export const ZPartialTextFieldStateTheme = ZTextFieldStateTheme.partial();

export type TextFieldStateTheme = z.infer<typeof ZTextFieldStateTheme>;
export type PartialTextFieldStateTheme = z.infer<typeof ZPartialTextFieldStateTheme>;

export const ZTextFieldTheme        = z.object(
    {
        idle    : ZTextFieldStateTheme,
        focused : ZTextFieldStateTheme,
        disabled: ZTextFieldStateTheme,
        invalid : ZTextFieldStateTheme
    }
);
export const ZPartialTextFieldTheme = ZTextFieldTheme.partial();

export type TextFieldTheme = z.infer<typeof ZTextFieldTheme>;
export type PartialTextFieldTheme = z.infer<typeof ZPartialTextFieldTheme>;
