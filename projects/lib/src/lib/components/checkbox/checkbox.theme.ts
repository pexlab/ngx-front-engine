import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZCheckboxTheme = z.object(
    {
        labelChecked   : ZHexColor,
        labelUnchecked : ZHexColor,
        checkmark      : ZHexColor,
        fillChecked    : ZHexColor,
        fillUnchecked  : ZHexColor,
        outlineIdle    : ZHexColor,
        outlineHover   : ZHexColor,
        outlineChecked : ZHexColor,
        hoverBackground: ZHexColor
    }
);

export const ZPartialCheckboxTheme = ZCheckboxTheme.partial();

export type CheckboxTheme = z.infer<typeof ZCheckboxTheme>;
export type PartialCheckboxTheme = z.infer<typeof ZPartialCheckboxTheme>;
