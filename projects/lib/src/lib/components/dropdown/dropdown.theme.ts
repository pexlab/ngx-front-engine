import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZDropdownTheme = z.object(
    {

        placeholderIdlePanelText      : ZHexColor,
        placeholderIdlePanelBorder    : ZHexColor,
        placeholderIdlePanelBackground: ZHexColor,
        placeholderBorderBottom       : ZHexColor,

        placeholderSelectedPanelText      : ZHexColor,
        placeholderSelectedPanelBorder    : ZHexColor,
        placeholderSelectedPanelBackground: ZHexColor,

        optionsStripe         : ZHexColor,
        optionsIdleText       : ZHexColor,
        optionsIdleBackground : ZHexColor,
        optionsHoverText      : ZHexColor,
        optionsHoverBackground: ZHexColor,

        clearButtonIdle           : ZHexColor,
        clearButtonIdleBackground : ZHexColor,
        clearButtonHover          : ZHexColor,
        clearButtonHoverBackground: ZHexColor
    }
);

export const ZPartialDropdownTheme = ZDropdownTheme.partial();

export type DropdownTheme = z.infer<typeof ZDropdownTheme>;
export type PartialDropdownTheme = z.infer<typeof ZPartialDropdownTheme>;
