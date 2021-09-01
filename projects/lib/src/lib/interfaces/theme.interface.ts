import { z } from 'zod';
import { ZButtonTheme } from '../components/button/button.component';
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
                        primary: ZHEXColor
                    }
                ),
                
                text: z.object(
                    {
                        primary  : ZHEXColor,
                        secondary: ZHEXColor,
                        tertiary : ZHEXColor
                    }
                ),
                
                background: z.object(
                    {
                        primary  : ZHEXColor,
                        secondary: ZHEXColor,
                        tertiary : ZHEXColor
                    }
                ),
                
                alert: z.object(
                    {
                        success: ZHEXColor,
                        failure: ZHEXColor,
                        warning: ZHEXColor,
                        info   : ZHEXColor
                    }
                ),
                
                custom: z.record( ZHEXColor ).optional()
            }
        )
    }
);

export const ZPartialCommonTheme = ZCommonTheme.deepPartial();

export type ThemeableComponents = 'textField' | 'button';

/** Used to guarantee that each component is preset but also gets assigned its very own type */
function createComponentThemes<c extends { [key in ThemeableComponents]: unknown }>( shape: c ): c {
    return shape;
}

export const ZComponentThemes = z.object(
    createComponentThemes(
        {
            textField: ZTextFieldTheme,
            button   : ZButtonTheme
        }
    )
);

export const ZPartialComponentThemes = ZComponentThemes.deepPartial();

export type CommonTheme = z.infer<typeof ZCommonTheme>;
export type PartialCommonTheme = z.infer<typeof ZPartialCommonTheme>;
export type ComponentThemes = z.infer<typeof ZComponentThemes>;
export type PartialComponentThemes = z.infer<typeof ZPartialComponentThemes>;