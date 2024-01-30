import { z } from 'zod';
import { ZAlertPortalTheme } from '../components/alert-portal/alert-portal.theme';
import { ZBannerCarouselTheme } from '../components/banner-carousel/banner-carousel.theme';
import { ZBookTheme } from '../components/book/book.theme';
import { ZButtonTheme } from '../components/button/button.theme';
import { ZCheckboxTheme } from '../components/checkbox/checkbox.theme';
import { ZCommentTheme } from '../components/comment/comment.theme';
import { ZDropdownTheme } from '../components/dropdown/dropdown.theme';
import { ZNotepaperTheme } from '../components/notepaper/notepaper.theme';
import { ZPopupTheme } from '../components/popup/popup.theme';
import { ZSpeedometerTheme } from '../components/speedometer/speedometer.theme';
import { ZStepperTheme } from '../components/stepper/stepper.theme';
import { ZSwitchTheme } from '../components/switch/switch.theme';
import { ZInlineTableTheme } from '../components/table/inline/inline-table.theme';
import { ZTableTheme } from '../components/table/table.theme';
import { ZTextFieldTheme } from '../components/text-field/text-field.theme';
import { ZVirtualScrollTheme } from '../components/virtual-scroll/virtual-scroll.theme';
import { ZHexColor } from './color.interface';
import { ZFont } from './typography.interface';

export const ZCommonTheme = z.object(
    {

        typography: z.object(
            {
                display            : ZFont,
                heading            : ZFont,
                subheading         : ZFont,
                body               : ZFont,
                alternative        : ZFont,
                decorative         : ZFont,
                caption            : ZFont,
                code               : ZFont,
                handwritten_heading: ZFont,
                handwritten_body   : ZFont
            }
        ),

        palette: z.object(
            {
                accent: z.object(
                    {
                        primary         : ZHexColor,
                        primary_dimmed  : ZHexColor,
                        secondary       : ZHexColor,
                        secondary_dimmed: ZHexColor,
                        tab_bar         : ZHexColor,
                        generic         : ZHexColor,
                        info            : ZHexColor,
                        success         : ZHexColor,
                        failure         : ZHexColor,
                        warning         : ZHexColor
                    }
                ),

                text: z.object(
                    {
                        primary            : ZHexColor,
                        secondary          : ZHexColor,
                        tertiary           : ZHexColor,
                        failure            : ZHexColor,
                        on_primary_accent  : ZHexColor,
                        on_secondary_accent: ZHexColor
                    }
                ),

                background: z.object(
                    {
                        primary   : ZHexColor,
                        secondary : ZHexColor,
                        tertiary  : ZHexColor,
                        quaternary: ZHexColor
                    }
                ),

                custom: z.record( ZHexColor ).optional()
            }
        ),

        scale: z.number().gt( 0 )
    }
);

export const ZPartialCommonTheme = ZCommonTheme.deepPartial();

export const ZThemeableComponent = z.enum([
    'alertPortal',
    'bannerCarousel',
    'book',
    'button',
    'checkbox',
    'comment',
    'dropdown',
    'notepaper',
    'popup',
    'speedometer',
    'stepper',
    'switch',
    'table',
    'inlineTable',
    'textField',
    'virtualScroll'
]);

export type ThemeableComponents = z.infer<typeof ZThemeableComponent>;

// export type ThemeableComponents = 'alertPortal'
//                                   | 'bannerCarousel'
//                                   | 'book'
//                                   | 'button'
//                                   | 'checkbox'
//                                   | 'comment'
//                                   | 'dropdown'
//                                   | 'notepaper'
//                                   | 'popup'
//                                   | 'speedometer'
//                                   | 'stepper'
//                                   | 'switch'
//                                   | 'table'
//                                   | 'inlineTable'
//                                   | 'textField'
//                                   | 'virtualScroll';

/** Used to guarantee that each component is preset but also gets assigned its very own type */
function createComponentThemes<c extends { [key in ThemeableComponents]: unknown }>( shape: c ): c {
    return shape;
}

export const ZComponentThemes = z.object(
    createComponentThemes(
        {
            alertPortal   : ZAlertPortalTheme,
            bannerCarousel: ZBannerCarouselTheme,
            book          : ZBookTheme,
            button        : ZButtonTheme,
            checkbox      : ZCheckboxTheme,
            comment       : ZCommentTheme,
            dropdown      : ZDropdownTheme,
            notepaper     : ZNotepaperTheme,
            popup         : ZPopupTheme,
            speedometer   : ZSpeedometerTheme,
            stepper       : ZStepperTheme,
            switch        : ZSwitchTheme,
            table         : ZTableTheme,
            inlineTable   : ZInlineTableTheme,
            textField     : ZTextFieldTheme,
            virtualScroll : ZVirtualScrollTheme
        }
    )
);

export const ZPartialComponentThemes = ZComponentThemes.deepPartial();

export type CommonTheme = z.infer<typeof ZCommonTheme>;
export type PartialCommonTheme = z.infer<typeof ZPartialCommonTheme>;
export type ComponentThemes = z.infer<typeof ZComponentThemes>;
export type PartialComponentThemes = z.infer<typeof ZPartialComponentThemes>;
