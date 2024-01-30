import { rgb } from 'wcag-contrast';
import { HexColor, RgbColor, WcagContrastHexColor, ZHexColor, EvaluatedColor, WcagContrastRgbColor } from '../interfaces/color.interface';
import { ThemeService } from './theme.service';

export class Color implements EvaluatedColor {

    constructor( name: string = '', hex: string, service?: ThemeService ) {
        this.nameVal    = name;
        this.hexVal     = Color.ensureHexAlphaFormat( hex );
        this.serviceVal = service;
    }

    private readonly nameVal: string;
    private readonly hexVal: HexColor;
    private readonly serviceVal?: ThemeService;

    /* Only as fallback if the service value hasn't been set */
    private localCache?: EvaluatedColor;

    private get evaluated(): EvaluatedColor | undefined {
        return this.serviceVal?.matchColor( this.hexVal, this.nameVal ) || this.localCache;
    }

    private set evaluated( value: EvaluatedColor | undefined ) {

        if ( !this.serviceVal ) {
            console.warn(
                'Since ThemeService has not been set for theme \"' + this.nameVal + '\" (' + this.hexVal + ') global caching is' +
                ' unavailable. Falling back to local cache. This however potentially decreases performance.'
            );
        }

        if ( this.serviceVal && value ) {

            this.serviceVal.writeColor( value );

        } else {

            this.localCache = value;
        }
    }

    public get name(): EvaluatedColor['name'] {
        return this.nameVal;
    }

    public get hex(): EvaluatedColor['hex'] {
        return this.hexVal;
    }

    public get channels(): EvaluatedColor['channels'] {
        return this.matchOrScratch().channels;
    }

    public get brightness(): EvaluatedColor['brightness'] {
        return this.matchOrScratch().brightness;
    }

    public get legible_contrast(): EvaluatedColor['legible_contrast'] {
        return this.matchOrScratch().legible_contrast;
    }

    public get isGloballyCached(): boolean {
        return !!this.serviceVal;
    }

    /* Tries to fetch a cached version of the theme, if not evaluate from scratch */
    private matchOrScratch(): EvaluatedColor {
        return this.evaluated || this.evaluateFromScratch();
    }

    private evaluateFromScratch(): EvaluatedColor {

        const rgbVal         = Color.toRGB( this.hexVal );
        const contrastHexVal = Color.getWCAGContrast( [ this.hexVal ] );
        const contrastRgbVal = Color.toRGB( contrastHexVal );

        const result: EvaluatedColor = {
            name            : this.nameVal,
            hex             : this.hexVal,
            channels        : {
                red  : rgbVal.red,
                green: rgbVal.green,
                blue : rgbVal.blue,
                alpha: rgbVal.alpha
            },
            legible_contrast: {
                hex     : contrastHexVal,
                channels: {
                    red  : contrastRgbVal.red,
                    green: contrastRgbVal.green,
                    blue : contrastRgbVal.blue,
                    alpha: contrastRgbVal.alpha
                } as WcagContrastRgbColor
            },
            brightness      : rgbVal.brightness
        };

        this.localCache = result;
        this.serviceVal?.writeColor( result );

        return result;
    }

    /* ==================== STATIC UTILITIES ==================== */

    /** Converts the 3-digit and 6-digit format both to a 8-digit format with an alpha channel  */
    public static ensureHexAlphaFormat( hex: HexColor ) {

        let parsedHex = ZHexColor.parse( hex );

        if ( parsedHex.length === 4 ) {

            /* Double every hex value up, then append opacity 1 */
            parsedHex = '#' +
                parsedHex.charAt( 1 ) + parsedHex.charAt( 1 ) +
                parsedHex.charAt( 2 ) + parsedHex.charAt( 2 ) +
                parsedHex.charAt( 3 ) + parsedHex.charAt( 3 ) +
                'FF';

        } else if ( parsedHex.length === 7 ) {
            parsedHex = parsedHex + 'FF'; /* Append opacity 1 */
        }

        return parsedHex.toLowerCase();
    }

    /** Determines the RGB values as well as additionally useful information */
    public static toRGB( hex: HexColor ): {
                                              highestValue: number,
                                              lowestValue: number,
                                              brightness: number
                                          } & RgbColor {

        const parsedHex = Color.ensureHexAlphaFormat( ZHexColor.parse( hex ) );

        const red   = parseInt( parsedHex.slice( 1, 3 ), 16 );
        const green = parseInt( parsedHex.slice( 3, 5 ), 16 );
        const blue  = parseInt( parsedHex.slice( 5, 7 ), 16 );
        const alpha = +( parseInt( parsedHex.slice( 7, 9 ), 16 ) / 255 ).toFixed( 3 );

        const highestValue = Math.max( ...[ red, green, blue ] );
        const lowestValue  = Math.min( ...[ red, green, blue ] );

        const brightness = +(
            (
                red + green + blue
            ) / 3 * alpha
        ).toFixed( 2 );

        return { red, green, blue, alpha, highestValue, lowestValue, brightness };
    }

    /** Changes the opacity of a hex theme */
    public static fadeHex( hex: HexColor, opacity: number ): string {

        const parsedHex = Color.ensureHexAlphaFormat( ZHexColor.parse( hex ) );

        if ( opacity < 0 || opacity > 1 ) {
            throw Error( 'Invalid opacity value' );
        }

        const hexOpacity = (
            Math.round( opacity * 255 ) + 0x10000
        ).toString( 16 ).substr( -2 );

        return (
            parsedHex.substr( 0, 7 ) + hexOpacity
        ).toLowerCase();
    }

    public static shadeHex( hex: string, percent: number ) {

        const parsedHex = Color.ensureHexAlphaFormat( ZHexColor.parse( hex ) );

        const rgb = Color.toRGB( parsedHex );

        /* Apply percent, which can be negative as well (Range: 0-1) */
        rgb.red   = Math.round( rgb.red + ( percent * rgb.red ) );
        rgb.green = Math.round( rgb.green + ( percent * rgb.green ) );
        rgb.blue  = Math.round( rgb.blue + ( percent * rgb.blue ) );

        const r = Math.max( Math.min( 255, rgb.red ), 0 ).toString( 16 );
        const g = Math.max( Math.min( 255, rgb.green ), 0 ).toString( 16 );
        const b = Math.max( Math.min( 255, rgb.blue ), 0 ).toString( 16 );

        const rr = ( r.length < 2 ? '0' : '' ) + r;
        const gg = ( g.length < 2 ? '0' : '' ) + g;
        const bb = ( b.length < 2 ? '0' : '' ) + b;

        return `#${ rr }${ gg }${ bb }`;
    }

    /** Determines whether white or black is more legible on the provided theme */
    public static getWCAGContrast( colors: HexColor[] ): WcagContrastHexColor {

        let averageR = 0;
        let averageG = 0;
        let averageB = 0;
        let averageA = 1;

        colors.forEach( ( hex ) => {

            const computed = Color.toRGB( hex );

            averageR += computed.red;
            averageG += computed.green;
            averageB += computed.blue;
            averageA += computed.alpha;
        } );

        averageR /= colors.length;
        averageG /= colors.length;
        averageB /= colors.length;
        averageA /= colors.length;

        const contrastWithBlackText = rgb(
            [ averageR, averageG, averageB ],
            [ 0, 0, 0 ]
        );
        const contrastWithWhiteText = rgb(
            [ averageR, averageG, averageB ],
            [ 255, 255, 255 ]
        );

        /* Accommodate that often white still is more legible */
        if ( Math.abs( contrastWithWhiteText - contrastWithBlackText ) > 2 ) {
            return contrastWithWhiteText > contrastWithBlackText ? '#ffffff' : '#000000';
        } else {
            return '#ffffff';
        }
    }
}
