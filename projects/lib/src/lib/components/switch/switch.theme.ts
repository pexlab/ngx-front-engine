import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZSwitchTheme = z.object(
    {

        /* Shared */

        activeLabel  : ZHEXColor,
        inactiveLabel: ZHEXColor,

        /* Minimal */

        minimalOuterBallLeft : ZHEXColor,
        minimalOuterBallRight: ZHEXColor,

        minimalInnerBallLeft : ZHEXColor,
        minimalInnerBallRight: ZHEXColor,

        minimalLineLeft : ZHEXColor,
        minimalLineRight: ZHEXColor,

        /* Traditional */

        traditionalBackgroundLeft : ZHEXColor,
        traditionalBackgroundRight: ZHEXColor,

        traditionalBorderLeft : ZHEXColor,
        traditionalBorderRight: ZHEXColor,

        traditionalBallLeft : ZHEXColor,
        traditionalBallRight: ZHEXColor,

        traditionalIconLeft : ZHEXColor,
        traditionalIconRight: ZHEXColor
    }
);

export const ZPartialSwitchTheme = ZSwitchTheme.partial();

export type SwitchTheme = z.infer<typeof ZSwitchTheme>;
export type PartialSwitchTheme = z.infer<typeof ZPartialSwitchTheme>;
