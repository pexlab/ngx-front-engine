import { z } from 'zod';
import { Color } from '../theme/color';
import { Replace } from '../utils/type.utils';

export const ZHexColor = z.string().refine( ( s ) => {
    return s.startsWith( '#' ) &&
        (
            s.length === 4 || s.length === 7 || s.length === 9
        );
} );

export const ZRgbColor = z.object(
    {
        red  : z.number().int().min( 0 ).max( 255 ),
        green: z.number().int().min( 0 ).max( 255 ),
        blue : z.number().int().min( 0 ).max( 255 ),
        alpha: z.number().max( 0 ).max( 1 )
    }
);

export const ZWcagContrastHexColor = z.union(
    [
        z.literal( '#ffffff' ),
        z.literal( '#000000' )
    ]
);

export const ZWcagContrastRgbColor = z.union(
    [
        z.object( {
            red  : z.literal( 0 ),
            green: z.literal( 0 ),
            blue : z.literal( 0 ),
            alpha: z.literal( 1 )
        } ),
        z.object( {
            red  : z.literal( 255 ),
            green: z.literal( 255 ),
            blue : z.literal( 255 ),
            alpha: z.literal( 1 )
        } )
    ]
);

export const ZEvaluatedColor = z.object(
    {
        name            : z.string().min(1),
        hex             : ZHexColor,
        channels        : ZRgbColor,
        brightness      : z.number().positive(),
        legible_contrast: z.object( {
            hex     : ZWcagContrastHexColor,
            channels: ZWcagContrastRgbColor
        } )
    }
);

export type HexColor = z.infer<typeof ZHexColor>;
export type RgbColor = z.infer<typeof ZRgbColor>;
export type EvaluatedColor = z.infer<typeof ZEvaluatedColor>;
export type WcagContrastHexColor = z.infer<typeof ZWcagContrastHexColor>;
export type WcagContrastRgbColor = z.infer<typeof ZWcagContrastRgbColor>;

export type HexColorRegister = { [ key: string ]: HexColor | HexColorRegister };
export type ColorRegister = { [ key: string ]: Color | ColorRegister };
export type ComponentTheme<T extends HexColorRegister = HexColorRegister> = {
    [ key: string ]: unknown,
    palette: T
}

export type ColorPalette = { [ key: string ]: { [ key: string ]: HexColor } };
export type EvaluatedColorPalette = Replace<ColorPalette, HexColor, Color>;

/** Enforce type safety on the platte while keeping the nested types for intellisense */
export function composePalette<T extends ColorPalette>( palette: T ): T {
    return palette;
}
