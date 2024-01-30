import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZAlertTheme = z.object(
    {

        title      : ZHexColor,
        description: ZHexColor,
        background : ZHexColor,

        icon          : ZHexColor,
        iconBackground: ZHexColor,

        code          : ZHexColor,
        codeBorder    : ZHexColor,
        codeBackground: ZHexColor
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
