import { z } from 'zod';
import { Color } from '../theme/color';
import { Replace } from '../utils/type.utils';

export const ZHEXColor = z.string().refine( ( s ) => {
    return s.startsWith( '#' ) &&
        (
            s.length === 4 || s.length === 7 || s.length === 9
        );
} );

export const ZRGBColor = z.object(
    {
        red  : z.number().min( 0 ).max( 255 ),
        green: z.number().min( 0 ).max( 255 ),
        blue : z.number().min( 0 ).max( 255 ),
        alpha: z.number().max( 0 ).max( 255 )
    }
);

export const ZWCAGContrast = z.union(
    [
        z.literal( 'white' ),
        z.literal( 'black' )
    ]
);

export const EvaluatedColor = z.object(
    {
        name            : z.string().nonempty(),
        hex             : ZHEXColor,
        channels        : ZRGBColor,
        brightness      : z.number().positive(),
        legible_contrast: ZWCAGContrast
    }
);

export type HEXColor = z.infer<typeof ZHEXColor>;
export type RGBColor = z.infer<typeof ZRGBColor>;
export type EvaluatedColor = z.infer<typeof EvaluatedColor>;
export type WCAGContrast = z.infer<typeof ZWCAGContrast>;

export type HEXColorRegister = { [ key: string ]: HEXColor | HEXColorRegister };
export type ColorRegister = { [ key: string ]: Color | ColorRegister };
export type ComponentTheme<T extends HEXColorRegister = HEXColorRegister> = {
    [ key: string ]: unknown,
    palette: T
}

export type ColorPalette = { [ key: string ]: { [ key: string ]: HEXColor } };
export type EvaluatedColorPalette = Replace<ColorPalette, HEXColor, Color>;

/** Enforce type safety on the platte while keeping the nested types for intellisense */
export function composePalette<T extends ColorPalette>( palette: T ): T {
    return palette;
}