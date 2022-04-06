import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZPopupTheme = z.object(
    {
        text              : ZHEXColor,
        background        : ZHEXColor,
        titleBarBackground: ZHEXColor,
        divider           : ZHEXColor,
        exit              : ZHEXColor,
        outerBorder       : ZHEXColor
    }
);

export const ZPartialPopupTheme = ZPopupTheme.partial();

export type PopupTheme = z.infer<typeof ZPopupTheme>;
export type PartialPopupTheme = z.infer<typeof ZPartialPopupTheme>;
