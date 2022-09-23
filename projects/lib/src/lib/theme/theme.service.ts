import { EventEmitter, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import deepdash from 'deepdash-es';
import lodash from 'lodash-es';
import { RootComponent } from '../components/root/root.component';
import { ColorRegister, EvaluatedColor, HEXColor, HEXColorRegister } from '../interfaces/color.interface';
import { CommonTheme, ComponentThemes, PartialCommonTheme, PartialComponentThemes } from '../interfaces/theme.interface';
import { Typography } from '../interfaces/typography.interface';
import { kebabCase } from '../utils/string.utils';
import { mergeObj } from '../utils/type.utils';
import { fes } from '../utils/unit.utils';
import { Color } from './color';
import { FeColorPalette } from './featured-palette';

const _ = deepdash( lodash );

@Injectable(
    {
        providedIn: 'root'
    }
)

export class ThemeService {

    constructor(
        private rendererFactory: RendererFactory2,
        private meta: Meta
    ) {

        if ( ThemeService.singleton !== undefined ) {
            throw new Error( 'An instance of ThemeService has already been created' );
        }

        this.renderer = rendererFactory.createRenderer( null, null );

        ThemeService.singleton = this;
    }

    /** Instance of ThemeService to use outside of regular Angular components (e.g. decorator functions) */
    public static singleton: ThemeService;

    public root?: RootComponent;

    private renderer: Renderer2;
    private globalCache: EvaluatedColor[] = [];

    private commonTheme!: CommonTheme;
    private componentThemes!: ComponentThemes;

    public onThemeChange: EventEmitter<void> = new EventEmitter();

    /* Public alias in order to obtain properties from the common theme */
    public get common(): CommonTheme {
        return this.commonTheme;
    }

    /* Public alias in order to obtain properties from the current component theme */
    public get component(): ComponentThemes {
        return this.componentThemes;
    }

    /** Try to find an already evaluated color in cache */
    public matchColor( matchHex: HEXColor, newName: string ): EvaluatedColor | undefined {

        const evaluated = this.globalCache.find( ( color ) => color.hex === matchHex );

        if ( evaluated ) {
            /* Overwrite the name of the found one with the given parameter */
            return { ...evaluated, ...{ name: newName } };
        }

        return undefined;
    }

    /** Cache an evaluated color in order to prevent repeated evaluation */
    public writeColor( color: EvaluatedColor ): void {
        this.globalCache.push( color );
    }

    /** Instantiate a class for every color in the palette */
    public evaluatePalette( palette: HEXColorRegister ): ColorRegister {
        return _.mapValuesDeep(
            palette,
            ( value, key ) => new Color( String( key ), value, this ),
            { leavesOnly: true }
        );
    }

    /* TODO: if element gets applied a different palette, store the the current one in memory to remove all those previous values */
    public applyPalette( palette: HEXColorRegister, element: HTMLElement, global = false ): void {

        /* Reset any previous local styling */
        if ( !global ) {
            element.getAttribute( 'style' )?.split( ';' ).forEach( ( str ) => {

                const styleKey = str.split( ':' )[ 0 ].replace( ' ', '' );

                if ( styleKey.startsWith( '--fe-local-color' ) ) {
                    this.renderer.removeStyle( element, styleKey, 2 );
                }
            } );
        }

        /* Extract every possible key/path from the palette */
        const elements = _.keysDeep( palette, { leavesOnly: true } );

        /* Iterate through every key/path and get its value. The key/path is needed to determine the name of the css property */
        elements.forEach( ( pathKey ) => {

            const key = String( pathKey );

            let value: any = palette;

            /* Walk the path to get the value */
            key.split( '.' ).forEach( ( keyPart ) => {
                value = value[ keyPart ];
            } );

            if ( value && typeof value === 'string' ) {

                const color        = new Color( undefined, value, this );
                const scope        = global ? 'global' : 'local';
                const propertyName = '--fe-' + scope + '-color-' + kebabCase( key );

                this.renderer.setStyle(
                    element,
                    propertyName + '-hex',
                    color.hex,
                    2
                );

                this.renderer.setStyle(
                    element,
                    propertyName + '-rgb',
                    color.channels.red + ', ' + color.channels.green + ', ' + color.channels.blue,
                    2
                );

                this.renderer.setStyle(
                    element,
                    propertyName + '-rgba',
                    color.channels.red + ', ' + color.channels.green + ', ' + color.channels.blue + ', ' + color.channels.alpha,
                    2
                );

                this.renderer.setStyle(
                    element,
                    propertyName + '-contrast',
                    color.legible_contrast,
                    2
                );
            }
        } );
    }

    public applyTypography( typography: Typography, element: HTMLElement, global = false ): void {

        Object.entries( typography ).forEach( ( font ) => {

            const propertyName = '--fe-' + (
                    global ? 'global' : 'local'
                ) + '-font-' +
                kebabCase( font[ 0 ] );

            this.renderer.setStyle(
                element,
                propertyName + '-family',
                '"' + font[ 1 ].name + '"',
                2
            );

            this.renderer.setStyle(
                element,
                propertyName + '-size',
                isNaN( +font[ 1 ].size ) ?
                font[ 1 ].size :
                fes( +font[ 1 ].size ),
                2
            );

            this.renderer.setStyle(
                element,
                propertyName + '-weight',
                font[ 1 ].weight,
                2
            );
        } );
    }

    /** Theme which includes commonly reused properties in other themes */
    public applyCommonTheme( theme?: PartialCommonTheme ) {

        const fallback: CommonTheme = {

            typography: {

                display: {
                    name  : 'Roboto',
                    size  : '1.85',
                    weight: 300
                },

                heading: {
                    name  : 'Jost',
                    size  : '1.25',
                    weight: 300
                },

                subheading: {
                    name  : 'Jost',
                    size  : '1.15',
                    weight: 300
                },

                body: {
                    name  : 'Jost',
                    size  : '0.85',
                    weight: 500
                },

                alternative: {
                    name  : 'Baloo Bhaina 2',
                    size  : '0.85',
                    weight: 400
                },

                decorative: {
                    name  : 'Roboto',
                    size  : '0.85',
                    weight: 300
                },

                caption: {
                    name  : 'Roboto',
                    size  : '0.75',
                    weight: 300
                },

                code: {
                    name  : 'Anonymous Pro',
                    size  : '0.85',
                    weight: 700
                },

                handwritten_heading: {
                    name  : 'Pangolin',
                    size  : '1.15',
                    weight: 400
                },

                handwritten_body: {
                    name  : 'Architects Daughter',
                    size  : '1',
                    weight: 400
                }
            },

            palette: {

                accent: {
                    primary         : FeColorPalette.Blue.PureBlue,
                    primary_dimmed  : FeColorPalette.Blue.VividDarkBlue,
                    secondary       : FeColorPalette.Greyscale.AlmostMidnight,
                    secondary_dimmed: FeColorPalette.Greyscale.Midnight,
                    tab_bar         : FeColorPalette.Greyscale.SnowWhite,
                    generic         : FeColorPalette.Greyscale.AlmostMidnight,
                    info            : FeColorPalette.Blue.NaturalBlue,
                    failure         : FeColorPalette.Red.SpanishRed,
                    success         : FeColorPalette.Green.Malachite,
                    warning         : FeColorPalette.Yellow.SliceOfCheese
                },

                text: {
                    primary            : FeColorPalette.Greyscale.Midnight,
                    secondary          : FeColorPalette.Greyscale.LightCharcoal,
                    tertiary           : FeColorPalette.Greyscale.SubtleGrey,
                    failure            : FeColorPalette.Red.Blood,
                    on_primary_accent  : FeColorPalette.Greyscale.SnowWhite,
                    on_secondary_accent: FeColorPalette.Greyscale.SnowWhite
                },

                background: {
                    primary   : FeColorPalette.Greyscale.SnowWhite,
                    secondary : FeColorPalette.Greyscale.BrightGrey,
                    tertiary  : FeColorPalette.Greyscale.Titanium,
                    quaternary: FeColorPalette.Greyscale.Smoke
                }
            },

            scale: 1
        };

        this.commonTheme = mergeObj(
            fallback,
            theme
        );

        this.applyPalette(
            this.commonTheme.palette,
            document.documentElement,
            true
        );

        this.applyTypography(
            this.commonTheme.typography,
            document.documentElement,
            true
        );

        this.renderer.setStyle(
            document.documentElement,
            '--fe-global-preference-scale',
            ( 16 * this.commonTheme.scale ) + 'px',
            2
        );

        if ( this.meta.getTag( 'name=theme-color' ) ) {
            this.meta.updateTag( { content: this.commonTheme.palette.accent.tab_bar }, 'name=theme-color' );
        } else {
            this.meta.addTag( { name: 'theme-color', content: this.commonTheme.palette.accent.tab_bar } );
        }

        this.onThemeChange.emit();
    }

    /** Default themes for all components of FrontEngine */
    public applyComponentThemes( themes?: PartialComponentThemes ) {

        const fallback: ComponentThemes = {

            alertPortal: {

                generic: {

                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.generic, .15 ),

                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.generic,

                    code          : this.commonTheme.palette.text.primary,
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },

                info: {

                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.info, .15 ),

                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.info,

                    code          : this.commonTheme.palette.text.primary,
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },

                success: {

                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.success, .15 ),

                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.success,

                    code          : this.commonTheme.palette.text.primary,
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },

                warning: {

                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.warning, .15 ),

                    icon          : FeColorPalette.Greyscale.PitchBlack,
                    iconBackground: this.commonTheme.palette.accent.warning,

                    code          : this.commonTheme.palette.text.primary,
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },

                error: {

                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.failure, .15 ),

                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.failure,

                    code          : this.commonTheme.palette.text.primary,
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                }
            },

            bannerCarousel: {

                richAppearance: {

                    heading   : this.commonTheme.palette.text.on_primary_accent,
                    subheading: Color.fadeHex( this.commonTheme.palette.text.on_primary_accent, .75 ),
                    background: this.commonTheme.palette.accent.primary,

                    buttonIdleText      : this.commonTheme.palette.text.on_primary_accent,
                    buttonIdleBackground: this.commonTheme.palette.accent.primary,

                    buttonHoverText      : this.commonTheme.palette.text.on_secondary_accent,
                    buttonHoverBackground: this.commonTheme.palette.accent.secondary
                },

                reducedAppearance: {

                    heading   : this.commonTheme.palette.text.primary,
                    subheading: this.commonTheme.palette.text.secondary,

                    buttonIdleText      : this.commonTheme.palette.accent.primary,
                    buttonIdleBackground: FeColorPalette.Greyscale.Transparent,

                    buttonHoverText      : this.commonTheme.palette.text.on_primary_accent,
                    buttonHoverBackground: this.commonTheme.palette.accent.primary
                }
            },

            book: {},

            button: {
                text        : this.commonTheme.palette.text.on_primary_accent,
                background  : this.commonTheme.palette.accent.primary,
                borderBottom: this.commonTheme.palette.accent.secondary,
                hinge       : {
                    hoverText      : this.commonTheme.palette.text.on_secondary_accent,
                    hoverBackground: this.commonTheme.palette.accent.secondary
                },
                circle      : {
                    tooltipText: this.commonTheme.palette.text.primary
                }
            },

            checkbox: {
                labelChecked   : this.commonTheme.palette.text.primary,
                labelUnchecked : this.commonTheme.palette.text.secondary,
                checkmark      : this.commonTheme.palette.text.on_primary_accent,
                fillChecked    : this.commonTheme.palette.accent.primary,
                fillUnchecked  : FeColorPalette.Greyscale.Transparent,
                outlineIdle    : this.commonTheme.palette.text.tertiary,
                outlineHover   : this.commonTheme.palette.accent.primary,
                outlineChecked : this.commonTheme.palette.accent.secondary,
                hoverBackground: Color.fadeHex( this.commonTheme.palette.accent.primary, .05 )
            },

            comment: {
                text         : this.commonTheme.palette.text.primary,
                date         : this.commonTheme.palette.text.tertiary,
                iconIdle     : this.commonTheme.palette.text.tertiary,
                verifiedBadge: FeColorPalette.Blue.Azure,
                border       : this.commonTheme.palette.background.tertiary,
                background   : this.commonTheme.palette.background.primary
            },

            dropdown: {

                placeholderIdlePanelText      : this.commonTheme.palette.text.on_primary_accent,
                placeholderIdlePanelBorder    : this.commonTheme.palette.accent.primary,
                placeholderIdlePanelBackground: this.commonTheme.palette.accent.primary,

                placeholderBorderBottom: this.commonTheme.palette.accent.secondary,

                placeholderSelectedPanelText      : this.commonTheme.palette.text.on_primary_accent,
                placeholderSelectedPanelBorder    : FeColorPalette.Greyscale.Transparent,
                placeholderSelectedPanelBackground: this.commonTheme.palette.accent.primary,

                optionsStripe         : this.commonTheme.palette.accent.primary,
                optionsIdleText       : this.commonTheme.palette.text.primary,
                optionsIdleBackground : this.commonTheme.palette.background.primary,
                optionsHoverText      : this.commonTheme.palette.text.primary,
                optionsHoverBackground: this.commonTheme.palette.background.secondary,

                clearButtonIdle           : this.commonTheme.palette.text.primary,
                clearButtonIdleBackground : FeColorPalette.Greyscale.Transparent,
                clearButtonHover          : this.commonTheme.palette.text.failure,
                clearButtonHoverBackground: Color.fadeHex( this.commonTheme.palette.accent.failure, .2 )
            },

            notepaper: {
                divider         : FeColorPalette.Brown.Leather,
                highlight       : Color.fadeHex( FeColorPalette.Red.Lips, .25 ),
                button          : FeColorPalette.Greyscale.Charcoal,
                backgroundHoles : this.commonTheme.palette.background.primary,
                backgroundTop   : FeColorPalette.Yellow.Mustard,
                backgroundBottom: FeColorPalette.Yellow.SliceOfCheese
            },

            popup: {

                desktop: {
                    border: FeColorPalette.Greyscale.Transparent,
                    title : {
                        text      : this.commonTheme.palette.text.primary,
                        border    : this.commonTheme.palette.background.tertiary,
                        exit      : this.commonTheme.palette.text.failure,
                        background: this.commonTheme.palette.background.primary
                    },
                    body  : {
                        text          : this.commonTheme.palette.text.primary,
                        background    : this.commonTheme.palette.background.primary,
                        scrollbar     : this.commonTheme.palette.background.tertiary,
                        scrollbarHover: this.commonTheme.palette.background.quaternary
                    }
                },

                mobile: {
                    title: {
                        text      : this.commonTheme.palette.text.primary,
                        border    : this.commonTheme.palette.background.tertiary,
                        exit      : this.commonTheme.palette.text.failure,
                        background: this.commonTheme.palette.background.primary
                    },
                    body : {
                        text          : this.commonTheme.palette.text.primary,
                        background    : this.commonTheme.palette.background.primary,
                        scrollbar     : this.commonTheme.palette.background.tertiary,
                        scrollbarHover: this.commonTheme.palette.background.quaternary
                    }
                }
            },

            speedometer: {

                hud: Color.fadeHex( FeColorPalette.Greyscale.SnowWhite, .8 ),

                border: {
                    inner: Color.fadeHex( FeColorPalette.Greyscale.SnowWhite, .15 ),
                    outer: Color.fadeHex( FeColorPalette.Greyscale.SnowWhite, .15 )
                },

                indicator: {
                    gradientStart: '#1949d5',
                    gradientEnd  : FeColorPalette.Cyan.AgalAquamarine
                },

                background: {
                    inner: FeColorPalette.Blue.PureBlue,
                    outer: '#171b27'
                },

                step: {
                    primary  : Color.fadeHex( FeColorPalette.Greyscale.SnowWhite, .8 ),
                    secondary: Color.fadeHex( FeColorPalette.Greyscale.SnowWhite, .4 )
                },

                text: {
                    inner     : FeColorPalette.Greyscale.SnowWhite,
                    outer     : FeColorPalette.Greyscale.SnowWhite,
                    outerShade: '#171b27',
                    hud       : '#171b27'
                },

                marker: {
                    fill        : Color.fadeHex( FeColorPalette.Cyan.AgalAquamarine, .3 ),
                    stroke      : FeColorPalette.Cyan.AgalAquamarine,
                    intermediate: Color.fadeHex( FeColorPalette.Cyan.AgalAquamarine, .5 )
                }
            },

            stepper: {
                text            : this.commonTheme.palette.text.primary,
                buttonIcon      : this.commonTheme.palette.text.on_primary_accent,
                buttonBackground: this.commonTheme.palette.accent.primary
            },

            switch: {

                activeLabel  : this.commonTheme.palette.text.primary,
                inactiveLabel: this.commonTheme.palette.text.secondary,

                minimalOuterBallLeft: this.commonTheme.palette.accent.secondary,
                minimalInnerBallLeft: this.commonTheme.palette.text.on_secondary_accent,
                minimalLineLeft     : this.commonTheme.palette.accent.secondary,

                minimalOuterBallRight: this.commonTheme.palette.accent.primary,
                minimalInnerBallRight: this.commonTheme.palette.text.on_primary_accent,
                minimalLineRight     : this.commonTheme.palette.accent.primary,

                traditionalBallLeft      : this.commonTheme.palette.accent.secondary,
                traditionalBorderLeft    : this.commonTheme.palette.accent.secondary,
                traditionalIconLeft      : this.commonTheme.palette.text.on_secondary_accent,
                traditionalBackgroundLeft: FeColorPalette.Greyscale.Transparent,

                traditionalBallRight      : this.commonTheme.palette.text.on_primary_accent,
                traditionalBorderRight    : this.commonTheme.palette.accent.primary,
                traditionalIconRight      : this.commonTheme.palette.accent.primary,
                traditionalBackgroundRight: this.commonTheme.palette.accent.primary
            },

            table: {
                text           : this.commonTheme.palette.text.primary,
                outline        : this.commonTheme.palette.text.tertiary,
                button         : {
                    text      : this.commonTheme.palette.text.on_primary_accent,
                    background: this.commonTheme.palette.accent.primary,
                    tooltip   : this.commonTheme.palette.text.primary
                },
                loader         : {
                    circle : this.commonTheme.palette.accent.primary,
                    stripeA: this.commonTheme.palette.accent.primary,
                    stripeB: Color.fadeHex( this.commonTheme.palette.accent.secondary, .3 )
                },
                dragHandle     : this.commonTheme.palette.background.quaternary,
                dragHandleHover: this.commonTheme.palette.text.primary,
                background     : {
                    header  : this.commonTheme.palette.background.primary,
                    rowEven : this.commonTheme.palette.background.primary,
                    rowOdd  : this.commonTheme.palette.background.secondary,
                    rowHover: this.commonTheme.palette.background.tertiary
                },
                highlight      : {
                    header : Color.fadeHex( this.commonTheme.palette.accent.primary, .2 ),
                    cell   : Color.fadeHex( this.commonTheme.palette.accent.primary, .2 ),
                    outline: this.commonTheme.palette.accent.primary
                }
            },

            textField: {

                idle: {
                    text             : this.commonTheme.palette.text.secondary,
                    border           : this.commonTheme.palette.text.tertiary,
                    divider          : this.commonTheme.palette.text.tertiary,
                    background       : FeColorPalette.Greyscale.Transparent,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.secondary,
                    icon             : this.commonTheme.palette.text.tertiary,
                    iconBackground   : Color.fadeHex( this.commonTheme.palette.text.tertiary, .2 )
                },

                focused: {
                    text             : this.commonTheme.palette.text.primary,
                    border           : this.commonTheme.palette.text.primary,
                    divider          : this.commonTheme.palette.text.primary,
                    background       : FeColorPalette.Greyscale.Transparent,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.primary,
                    icon             : this.commonTheme.palette.text.secondary,
                    iconBackground   : Color.fadeHex( this.commonTheme.palette.text.secondary, .2 )
                },

                disabled: {
                    text             : this.commonTheme.palette.text.secondary,
                    border           : this.commonTheme.palette.text.tertiary,
                    divider          : this.commonTheme.palette.text.tertiary,
                    background       : FeColorPalette.Greyscale.MistyMorning,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.secondary,
                    icon             : this.commonTheme.palette.text.tertiary,
                    iconBackground   : Color.fadeHex( this.commonTheme.palette.text.tertiary, .2 )
                },

                invalid: {
                    text             : this.commonTheme.palette.text.failure,
                    border           : this.commonTheme.palette.accent.failure,
                    divider          : this.commonTheme.palette.accent.failure,
                    background       : Color.fadeHex( this.commonTheme.palette.accent.failure, .1 ),
                    staticPlaceholder: this.commonTheme.palette.text.failure,
                    pinnedPlaceholder: this.commonTheme.palette.text.failure,
                    icon             : this.commonTheme.palette.accent.failure,
                    iconBackground   : Color.fadeHex( this.commonTheme.palette.accent.failure, .2 )
                }
            }
        };

        this.componentThemes = mergeObj(
            fallback,
            themes
        );

        this.applyPalette(
            this.componentThemes,
            document.documentElement,
            true
        );

        this.onThemeChange.emit();
    }
}
