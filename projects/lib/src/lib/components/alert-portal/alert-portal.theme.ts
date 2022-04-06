import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZAlertTheme = z.object(
    {

        title      : ZHEXColor,
        description: ZHEXColor,
        background : ZHEXColor,

        icon          : ZHEXColor,
        iconBackground: ZHEXColor,

        code          : ZHEXColor,
        codeBorder    : ZHEXColor,
        codeBackground: ZHEXColor
    }
);

export const ZAlertPortalTheme = z.object(
    {
        generic: ZAlertTheme,
        info   : ZAlertTheme,
        success: ZAlertTheme,
        warning: ZAlertTheme,
        error  : ZAlertTheme
    }
);

export const ZPartialAlertPortalTheme = ZAlertPortalTheme.partial();

export type AlertPortalTheme = z.infer<typeof ZAlertPortalTheme>;
export type PartialAlertPortalTheme = z.infer<typeof ZPartialAlertPortalTheme>;
