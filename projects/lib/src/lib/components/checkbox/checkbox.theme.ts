import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZCheckboxTheme = z.object(
    {
        labelChecked   : ZHEXColor,
        labelUnchecked : ZHEXColor,
        checkmark      : ZHEXColor,
        fillChecked    : ZHEXColor,
        fillUnchecked  : ZHEXColor,
        outlineIdle    : ZHEXColor,
        outlineHover   : ZHEXColor,
        outlineChecked : ZHEXColor,
        hoverBackground: ZHEXColor
    }
);

export const ZPartialCheckboxTheme = ZCheckboxTheme.partial();

export type CheckboxTheme = z.infer<typeof ZCheckboxTheme>;
export type PartialCheckboxTheme = z.infer<typeof ZPartialCheckboxTheme>;
