import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZSwitchTheme = z.object(
    {

        /* Shared */

        activeLabel  : ZHexColor,
        inactiveLabel: ZHexColor,

        /* Minimal */

        minimalOuterBallLeft : ZHexColor,
        minimalOuterBallRight: ZHexColor,

        minimalInnerBallLeft : ZHexColor,
        minimalInnerBallRight: ZHexColor,

        minimalLineLeft : ZHexColor,
        minimalLineRight: ZHexColor,

        /* Traditional */

        traditionalBackgroundLeft : ZHexColor,
        traditionalBackgroundRight: ZHexColor,

        traditionalBorderLeft : ZHexColor,
        traditionalBorderRight: ZHexColor,

        traditionalBallLeft : ZHexColor,
        traditionalBallRight: ZHexColor,

        traditionalIconLeft : ZHexColor,
        traditionalIconRight: ZHexColor
    }
);

export const ZPartialSwitchTheme = ZSwitchTheme.partial();

export type SwitchTheme = z.infer<typeof ZSwitchTheme>;
export type PartialSwitchTheme = z.infer<typeof ZPartialSwitchTheme>;
