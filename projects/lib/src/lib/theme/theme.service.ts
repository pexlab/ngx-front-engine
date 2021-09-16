import { Injectable, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentThemes, CommonTheme, PartialComponentThemes, PartialCommonTheme } from '../interfaces/theme.interface';
import { Typography } from '../interfaces/typography.interface';
import { kebabCase } from '../utils/case.utils';
import { mergeObj, Replace } from '../utils/type.utils';
import { Color } from './color';
import { ColorPalette, EvaluatedColor, EvaluatedColorPalette, HEXColor, ZHEXColor } from '../interfaces/color.interface';
import { FeColorPalette } from './featured-palette';

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
    public evaluatePalette<P extends ColorPalette, R extends Replace<P, HEXColor, Color>>( palette: P ): R {
        
        let evaluatedCategory!: R;
        
        Object.entries( palette ).map( ( category ) => {
            
            let evaluatedColors!: { [k in keyof R]: Color };
            
            Object.entries( category[ 1 ] ).map( ( color ) => {
                evaluatedColors = {
                    ...evaluatedColors,
                    ...{
                        [ color[ 0 ] ]: new Color( color[ 0 ], color[ 1 ], this )
                    }
                };
            } );
            
            evaluatedCategory = {
                ...evaluatedCategory,
                ...{
                    [ category[ 0 ] ]: evaluatedColors
                }
            };
        } );
        
        return evaluatedCategory;
    }
    
    /* TODO: if element gets applied a different palette, store the the current one in memory to remove all those previous values */
    public applyPalette( palette: EvaluatedColorPalette, element: HTMLElement, global = false ): void {
        
        Object.entries( palette ).forEach( ( category ) => {
            
            Object.values( category[ 1 ] ).forEach( ( color ) => {
                
                const propertyName = '--fe-' + (
                        global ? 'global' : 'local'
                    ) + '-color-' +
                    kebabCase( category[ 0 ] ) + '-' + kebabCase( color.name );
                
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
            } );
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
                    failure         : FeColorPalette.Red.SpanishRed,
                    success         : FeColorPalette.Green.Emerald,
                    warning         : FeColorPalette.Yellow.VividPostIt,
                    info            : FeColorPalette.Blue.Sky
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
                    primary  : FeColorPalette.Greyscale.SnowWhite,
                    secondary: FeColorPalette.Greyscale.BrightGrey,
                    tertiary : FeColorPalette.Greyscale.Titanium
                }
            }
        };
        
        this.commonTheme = mergeObj(
            fallback,
            theme
        );
        
        this.applyPalette(
            this.evaluatePalette( this.commonTheme.palette ),
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
                
                idleText      : this.commonTheme.palette.text.secondary,
                idleBorder    : this.commonTheme.palette.text.tertiary,
                idleDivider   : this.commonTheme.palette.text.tertiary,
                idleBackground: FeColorPalette.Greyscale.Transparent,
                
                focusText      : this.commonTheme.palette.text.primary,
                focusBorder    : this.commonTheme.palette.text.primary,
                focusDivider   : this.commonTheme.palette.text.primary,
                focusBackground: FeColorPalette.Greyscale.Transparent,
                
                placeholderPinnedFocused    : this.commonTheme.palette.text.primary,
                placeholderPinnedUnfocused  : this.commonTheme.palette.text.secondary,
                placeholderUnpinnedFocused  : this.commonTheme.palette.text.tertiary,
                placeholderUnpinnedUnfocused: this.commonTheme.palette.text.tertiary,
                
                errorText       : this.commonTheme.palette.text.failure,
                errorPlaceholder: this.commonTheme.palette.text.failure,
                errorBorder     : this.commonTheme.palette.accent.failure,
                errorDivider    : this.commonTheme.palette.accent.failure,
                errorBackground : Color.fadeHex( this.commonTheme.palette.accent.failure, .1 )
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
            }
        };
        
        this.componentThemes = mergeObj(
            fallback,
            themes
        );
        
        this.applyPalette(
            this.evaluatePalette( this.componentThemes ),
            document.documentElement,
            true
        );
    }
}