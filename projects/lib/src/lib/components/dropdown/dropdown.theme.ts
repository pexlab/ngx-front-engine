import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZDropdownTheme = z.object(
    {

        placeholderIdlePanelText      : ZHEXColor,
        placeholderIdlePanelBorder    : ZHEXColor,
        placeholderIdlePanelBackground: ZHEXColor,
        placeholderBorderBottom       : ZHEXColor,

        placeholderSelectedPanelText      : ZHEXColor,
        placeholderSelectedPanelBorder    : ZHEXColor,
        placeholderSelectedPanelBackground: ZHEXColor,

        optionsStripe         : ZHEXColor,
        optionsIdleText       : ZHEXColor,
        optionsIdleBackground : ZHEXColor,
        optionsHoverText      : ZHEXColor,
        optionsHoverBackground: ZHEXColor,

        clearButtonIdle           : ZHEXColor,
        clearButtonIdleBackground : ZHEXColor,
        clearButtonHover          : ZHEXColor,
        clearButtonHoverBackground: ZHEXColor
    }
);

export const ZPartialDropdownTheme = ZDropdownTheme.partial();

export type DropdownTheme = z.infer<typeof ZDropdownTheme>;
export type PartialDropdownTheme = z.infer<typeof ZPartialDropdownTheme>;
