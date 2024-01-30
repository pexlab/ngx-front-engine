import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

export const ZPopupTheme = z.object(
    {
        desktop: z.object(
            {

                border: ZHexColor,

                title: z.object(
                    {
                        text      : ZHexColor,
                        background: ZHexColor,
                        border    : ZHexColor,
                        exit      : ZHexColor
                    }
                ),

                body: z.object(
                    {
                        text          : ZHexColor,
                        background    : ZHexColor,
                        scrollbar     : ZHexColor,
                        scrollbarHover: ZHexColor
                    }
                )
            }
        ),
        mobile : z.object(
            {
                title: z.object(
                    {
                        text      : ZHexColor,
                        background: ZHexColor,
                        border    : ZHexColor,
                        exit      : ZHexColor
                    }
                ),
                body : z.object(
                    {
                        text          : ZHexColor,
                        background    : ZHexColor,
                        scrollbar     : ZHexColor,
                        scrollbarHover: ZHexColor
                    }
                )
            }
        )
    }
);

export const ZPartialPopupTheme = ZPopupTheme.partial();

export type PopupTheme = z.infer<typeof ZPopupTheme>;
export type PartialPopupTheme = z.infer<typeof ZPartialPopupTheme>;
