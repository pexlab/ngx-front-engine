import { z } from 'zod';
import { ZAlertPortalTheme } from '../components/alert-portal/alert-portal.component';
import { ZBannerCarouselTheme } from '../components/banner-carousel/banner-carousel.component';
import { ZButtonTheme } from '../components/button/button.component';
import { ZCheckboxTheme } from '../components/checkbox/checkbox.component';
import { ZDropdownTheme } from '../components/dropdown/dropdown.component';
import { ZPopupTheme } from '../components/popup/popup.component';
import { ZStepperTheme } from '../components/stepper/stepper.component';
import { ZSwitchTheme } from '../components/switch/switch.component';
import { ZTextFieldTheme } from '../components/text-field/text-field.component';
import { ZHEXColor } from './color.interface';
import { ZFont } from './typography.interface';

export const ZCommonTheme = z.object(
    {
        
        typography: z.object(
            {
                display   : ZFont,
                heading   : ZFont,
                subheading: ZFont,
                body      : ZFont,
                decorative: ZFont,
                caption   : ZFont,
                code      : ZFont
            }
        ),
        
        palette: z.object(
            {
                accent: z.object(
                    {
                        primary         : ZHEXColor,
                        primary_dimmed  : ZHEXColor,
                        secondary       : ZHEXColor,
                        secondary_dimmed: ZHEXColor,
                        generic         : ZHEXColor,
                        info            : ZHEXColor,
                        success         : ZHEXColor,
                        failure         : ZHEXColor,
                        warning         : ZHEXColor
                    }
                ),
                
                text: z.object(
                    {
                        primary            : ZHEXColor,
                        secondary          : ZHEXColor,
                        tertiary           : ZHEXColor,
                        failure            : ZHEXColor,
                        on_primary_accent  : ZHEXColor,
                        on_secondary_accent: ZHEXColor
                    }
                ),
                
                background: z.object(
                    {
                        primary   : ZHEXColor,
                        secondary : ZHEXColor,
                        tertiary  : ZHEXColor,
                        quaternary: ZHEXColor
                    }
                ),
                
                custom: z.record( ZHEXColor ).optional()
            }
        )
    }
);

export const ZPartialCommonTheme = ZCommonTheme.deepPartial();

export type ThemeableComponents = 'textField'
                                  | 'button'
                                  | 'dropdown'
                                  | 'checkbox'
                                  | 'stepper'
                                  | 'bannerCarousel'
                                  | 'switch'
                                  | 'popup'
                                  | 'alertPortal';

/** Used to guarantee that each component is preset but also gets assigned its very own type */
function createComponentThemes<c extends { [key in ThemeableComponents]: unknown }>( shape: c ): c {
    return shape;
}

export const ZComponentThemes = z.object(
    createComponentThemes(
        {
            textField     : ZTextFieldTheme,
            button        : ZButtonTheme,
            dropdown      : ZDropdownTheme,
            checkbox      : ZCheckboxTheme,
            stepper       : ZStepperTheme,
            bannerCarousel: ZBannerCarouselTheme,
            switch        : ZSwitchTheme,
            popup         : ZPopupTheme,
            alertPortal   : ZAlertPortalTheme
        }
    )
);

export const ZPartialComponentThemes = ZComponentThemes.deepPartial();

export type CommonTheme = z.infer<typeof ZCommonTheme>;
export type PartialCommonTheme = z.infer<typeof ZPartialCommonTheme>;
export type ComponentThemes = z.infer<typeof ZComponentThemes>;
export type PartialComponentThemes = z.infer<typeof ZPartialComponentThemes>;