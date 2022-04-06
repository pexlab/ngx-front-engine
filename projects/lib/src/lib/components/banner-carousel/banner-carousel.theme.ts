import { z } from 'zod';
import { ZHEXColor } from '../../interfaces/color.interface';

const ZBannerCarouselBase = z.object(
    {
        heading   : ZHEXColor,
        subheading: ZHEXColor,
        background: ZHEXColor,

        buttonIdleText      : ZHEXColor,
        buttonIdleBackground: ZHEXColor,

        buttonHoverText      : ZHEXColor,
        buttonHoverBackground: ZHEXColor
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
