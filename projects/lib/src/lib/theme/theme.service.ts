import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { RootComponent } from '../components/root/root.component';
import { ComponentThemes, CommonTheme, PartialComponentThemes, PartialCommonTheme } from '../interfaces/theme.interface';
import { Typography } from '../interfaces/typography.interface';
import { kebabCase } from '../utils/case.utils';
import { mergeObj } from '../utils/type.utils';
import { Color } from './color';
import { ColorRegister, EvaluatedColor, HEXColor, HEXColorRegister } from '../interfaces/color.interface';
import { FeColorPalette } from './featured-palette';
import * as lodash from 'lodash';
import deepdash from 'deepdash-es';

const _ = deepdash( lodash );

@Injectable(
    {
        providedIn: 'root'
    }
)

export class ThemeService {
    
    constructor(
        rendererFactory: RendererFactory2
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
    
    /* Public alias in order to obtain properties from the common theme */
    public get common(): CommonTheme {
        return this.commonTheme;
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
        
        /* Extract every possible key/path from the palette */
        const elements = _.keysDeep( palette, { leavesOnly: true } );
        
        /* Iterate through every key/path and get it's value. The key/path is needed to determine the name of the css property */
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
                font[ 1 ].name,
                2
            );
            
            this.renderer.setStyle(
                element,
                propertyName + '-size',
                font[ 1 ].size,
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
                    size  : '30px',
                    weight: 300
                },
                
                heading: {
                    name  : 'Jost',
                    size  : '20px',
                    weight: 300
                },
                
                subheading: {
                    name  : 'Jost',
                    size  : '18px',
                    weight: 300
                },
                
                body: {
                    name  : 'Jost',
                    size  : '14px',
                    weight: 500
                },
                
                decorative: {
                    name  : 'Roboto',
                    size  : '14px',
                    weight: 300
                },
                
                caption: {
                    name  : 'Roboto',
                    size  : '12px',
                    weight: 300
                },
                
                code: {
                    name  : 'Anonymous Pro',
                    size  : '14px',
                    weight: 700
                }
            },
            
            palette: {
                
                accent: {
                    primary         : FeColorPalette.Blue.PureBlue,
                    primary_dimmed  : FeColorPalette.Blue.VividDarkBlue,
                    secondary       : FeColorPalette.Greyscale.AlmostMidnight,
                    secondary_dimmed: FeColorPalette.Greyscale.Midnight,
                    generic         : FeColorPalette.Greyscale.AlmostMidnight,
                    info            : FeColorPalette.Blue.NaturalBlue,
                    failure         : FeColorPalette.Red.SpanishRed,
                    success         : FeColorPalette.Green.Malachite,
                    warning         : FeColorPalette.Yellow.VividPostIt
                },
                
                text: {
                    primary            : FeColorPalette.Greyscale.Midnight,
                    secondary          : FeColorPalette.Greyscale.LightCharcoal,
                    tertiary           : FeColorPalette.Greyscale.Smoke,
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
            }
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
    }
    
    /** Default themes for all components of FrontEngine */
    public applyComponentThemes( themes?: PartialComponentThemes ) {
        
        const fallback: ComponentThemes = {
            
            textField: {
                
                idle: {
                    text             : this.commonTheme.palette.text.secondary,
                    border           : this.commonTheme.palette.text.tertiary,
                    divider          : this.commonTheme.palette.text.tertiary,
                    background       : FeColorPalette.Greyscale.Transparent,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.secondary
                },
                
                focused: {
                    text             : this.commonTheme.palette.text.primary,
                    border           : this.commonTheme.palette.text.primary,
                    divider          : this.commonTheme.palette.text.primary,
                    background       : FeColorPalette.Greyscale.Transparent,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.primary
                },
                
                disabled: {
                    text             : this.commonTheme.palette.text.secondary,
                    border           : this.commonTheme.palette.text.tertiary,
                    divider          : this.commonTheme.palette.text.tertiary,
                    background       : FeColorPalette.Greyscale.MistyMorning,
                    staticPlaceholder: this.commonTheme.palette.text.tertiary,
                    pinnedPlaceholder: this.commonTheme.palette.text.secondary
                },
                
                invalid: {
                    text             : this.commonTheme.palette.text.failure,
                    border           : this.commonTheme.palette.accent.failure,
                    divider          : this.commonTheme.palette.accent.failure,
                    background       : Color.fadeHex( this.commonTheme.palette.accent.failure, .1 ),
                    staticPlaceholder: this.commonTheme.palette.text.failure,
                    pinnedPlaceholder: this.commonTheme.palette.text.failure
                }
            },
            
            button: {
                text        : this.commonTheme.palette.text.on_primary_accent,
                background  : this.commonTheme.palette.accent.primary,
                borderBottom: this.commonTheme.palette.accent.secondary
            },
            
            dropdown: {
                
                placeholderPanelText      : this.commonTheme.palette.text.on_primary_accent,
                placeholderPanelBackground: this.commonTheme.palette.accent.primary,
                
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
            
            stepper: {
                text            : this.commonTheme.palette.text.primary,
                buttonIcon      : this.commonTheme.palette.text.on_primary_accent,
                buttonBackground: this.commonTheme.palette.accent.primary
            },
            
            bannerCarousel: {
                
                heading   : this.commonTheme.palette.text.on_primary_accent,
                subheading: Color.fadeHex( this.commonTheme.palette.text.on_primary_accent, .75 ),
                background: this.commonTheme.palette.accent.primary,
                
                buttonIdleText      : this.commonTheme.palette.text.on_primary_accent,
                buttonIdleBackground: this.commonTheme.palette.accent.primary,
                
                buttonHoverText      : this.commonTheme.palette.text.on_secondary_accent,
                buttonHoverBackground: this.commonTheme.palette.accent.secondary
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
            
            popup: {
                divider    : this.commonTheme.palette.text.tertiary,
                background : this.commonTheme.palette.background.primary,
                text       : this.commonTheme.palette.text.primary,
                exit       : this.commonTheme.palette.text.failure,
                outerBorder: FeColorPalette.Greyscale.Transparent
            },
            
            alertPortal: {
                
                generic: {
                    
                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.generic, .15 ),
                    
                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.generic,
                    
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },
                
                info: {
                    
                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.info, .15 ),
                    
                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.info,
                    
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },
                
                success: {
                    
                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.success, .15 ),
                    
                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.success,
                    
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },
                
                warning: {
                    
                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.warning, .15 ),
                    
                    icon          : FeColorPalette.Greyscale.PitchBlack,
                    iconBackground: this.commonTheme.palette.accent.warning,
                    
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                },
                
                error: {
                    
                    title      : this.commonTheme.palette.text.primary,
                    description: this.commonTheme.palette.text.primary,
                    background : Color.fadeHex( this.commonTheme.palette.accent.failure, .15 ),
                    
                    icon          : FeColorPalette.Greyscale.SnowWhite,
                    iconBackground: this.commonTheme.palette.accent.failure,
                    
                    codeBorder    : this.commonTheme.palette.background.quaternary,
                    codeBackground: this.commonTheme.palette.background.tertiary
                }
            },
            
            speedometer: {
                
                hud: FeColorPalette.Greyscale.SnowWhite,
                
                border: {
                    inner: FeColorPalette.Greyscale.SnowWhite,
                    outer: FeColorPalette.Cyan.AgalAquamarine
                },
                
                indicator: {
                    gradientStart: FeColorPalette.Blue.VividCatalinaBlue,
                    gradientEnd  : FeColorPalette.Cyan.AgalAquamarine
                },
                
                background: {
                    inner: FeColorPalette.Blue.PureBlue,
                    outer: FeColorPalette.Blue.Eclipse
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
    }
}