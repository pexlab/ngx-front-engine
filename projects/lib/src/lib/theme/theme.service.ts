import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ComponentThemes, CommonTheme, PartialComponentThemes, PartialCommonTheme } from '../interfaces/theme.interface';
import { Typography } from '../interfaces/typography.interface';
import { kebabCase } from '../utils/case.utils';
import { mergeObj, Replace } from '../utils/type.utils';
import { Color } from './color';
import { ColorPalette, EvaluatedColor, EvaluatedColorPalette, HEXColor } from '../interfaces/color.interface';
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
                    size  : '20px',
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
                    primary: FeColorPalette.Blue.Blue
                },
                
                text: {
                    primary  : FeColorPalette.Ink.DarkNavyBlue,
                    secondary: FeColorPalette.Greyscale.LightCharcoal,
                    tertiary : FeColorPalette.Greyscale.Smoke
                },
                
                alert: {
                    success: FeColorPalette.Green.Emerald,
                    warning: FeColorPalette.Yellow.VividYellow,
                    failure: FeColorPalette.Red.Netflix,
                    info   : FeColorPalette.Blue.Sky
                },
                
                background: {
                    primary  : FeColorPalette.Greyscale.White,
                    secondary: FeColorPalette.Greyscale.SubtleGrey,
                    tertiary : FeColorPalette.Greyscale.Smoke
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
                
                errorText       : FeColorPalette.Red.NobleDarkRed,
                errorPlaceholder: FeColorPalette.Red.NobleDarkRed,
                errorBorder     : FeColorPalette.Red.Netflix,
                errorDivider    : FeColorPalette.Red.Netflix,
                errorBackground : Color.fadeHex( FeColorPalette.Red.Netflix, .1 )
            },
            
            button: {
                text        : FeColorPalette.Greyscale.White,
                background  : FeColorPalette.Blue.Blue,
                borderBottom: FeColorPalette.Blue.VividDarkBlue
            },
            
            dropdown: {
                
                placeholderPanelText      : FeColorPalette.Greyscale.White,
                placeholderPanelBackground: FeColorPalette.Blue.Blue,
                
                optionsStripe         : FeColorPalette.Blue.Blue,
                optionsIdleText       : FeColorPalette.Greyscale.PitchBlack,
                optionsIdleBackground : FeColorPalette.Greyscale.White,
                optionsHoverText      : FeColorPalette.Greyscale.PitchBlack,
                optionsHoverBackground: Color.fadeHex( FeColorPalette.Greyscale.PitchBlack, .05 ),
                
                clearButtonIdle           : FeColorPalette.Greyscale.PitchBlack,
                clearButtonIdleBackground : FeColorPalette.Greyscale.Transparent,
                clearButtonHover          : FeColorPalette.Red.Netflix,
                clearButtonHoverBackground: Color.fadeHex( FeColorPalette.Red.Coral, .15 )
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