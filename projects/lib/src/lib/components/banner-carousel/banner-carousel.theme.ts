import { z } from 'zod';
import { ZHexColor } from '../../interfaces/color.interface';

const ZBannerCarouselBase = z.object(
    {
        heading   : ZHexColor,
        subheading: ZHexColor,
        background: ZHexColor,

        buttonIdleText      : ZHexColor,
        buttonIdleBackground: ZHexColor,

        buttonHoverText      : ZHexColor,
        buttonHoverBackground: ZHexColor
    }
);

export const ZBannerCarouselTheme = z.object(
    {
        richAppearance   : ZBannerCarouselBase,
        reducedAppearance: ZBannerCarouselBase.omit( { background: true } )
    }
);

export const ZPartialBannerCarouselTheme = ZBannerCarouselTheme.deepPartial();

export type BannerCarouselTheme = z.infer<typeof ZBannerCarouselTheme>;
export type PartialBannerCarouselTheme = z.infer<typeof ZPartialBannerCarouselTheme>;
