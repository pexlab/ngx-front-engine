import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

export const ZPopupTheme = z.object(
    {
        desktop: z.object(
            {

                border: ZHEXColor,

                title: z.object(
                    {
                        text      : ZHEXColor,
                        background: ZHEXColor,
                        border    : ZHEXColor,
                        exit      : ZHEXColor
                    }
                ),

                body: z.object(
                    {
                        text          : ZHEXColor,
                        background    : ZHEXColor,
                        scrollbar     : ZHEXColor,
                        scrollbarHover: ZHEXColor
                    }
                )
            }
        ),
        mobile : z.object(
            {
                title: z.object(
                    {
                        text      : ZHEXColor,
                        background: ZHEXColor,
                        border    : ZHEXColor,
                        exit      : ZHEXColor
                    }
                ),
                body : z.object(
                    {
                        text          : ZHEXColor,
                        background    : ZHEXColor,
                        scrollbar     : ZHEXColor,
                        scrollbarHover: ZHEXColor
                    }
                )
            }
        )
    }
);

export const ZPartialPopupTheme = ZPopupTheme.partial();

export type PopupTheme = z.infer<typeof ZPopupTheme>;
export type PartialPopupTheme = z.infer<typeof ZPartialPopupTheme>;
