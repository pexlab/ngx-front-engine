import { ElementRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComponentTheme, HEXColor } from '../interfaces/color.interface';
import { ThemeableComponents } from '../interfaces/theme.interface';
import { ThemeService } from '../theme/theme.service';
import { ClassWithProperties } from './type.utils';
import { isEqual } from 'lodash';

export function FeComponent( name: ThemeableComponents ) {
    
    return function <C extends ClassWithProperties<{ feTheme: ComponentTheme, hostElement: ElementRef<HTMLElement> }>>( target: C ) {
        
        return class extends target {
            
            constructor( ...args: any[] ) {
                
                super( ...args );
                
                Reflect.defineProperty( this, 'feTheme', {
                    
                    set: ( theme: ComponentTheme | undefined ) => {
                        
                        /* TODO: when set undefined remove styling */
                        
                        const newPalette: { [ k: string ]: HEXColor } = theme?.palette || {};
                        
                        /* Only apply the palette if it has been changed */
                        if ( !isEqual( newPalette, this._previousPalette ) ) {
                            
                            this._previousPalette = newPalette;
                            
                            ThemeService.singleton.applyPalette(
                                ThemeService.singleton.evaluatePalette(
                                    {
                                        [ name ]: newPalette
                                    }
                                ),
                                this.hostElement.nativeElement
                            );
                        }
                        
                        this._feTheme = theme;
                    },
                    
                    get: () => {
                        return this._feTheme;
                    }
                } );
            }
            
            public _previousPalette: { [ k: string ]: HEXColor } = {};
            public _feTheme?: ComponentTheme;
        };
    };
}

export function FePopup() {
    
    return function <C extends ClassWithProperties<{ close: () => void, transmitToHost: ( value: any ) => void }>>( target: C ) {
        
        return class extends target {
            
            constructor( ...args: any[] ) {
                
                super( ...args );
                
                Reflect.defineProperty( this, 'transmitToHost', {
                    
                    value: ( value: any ) => {
                        
                        if ( value === 'fe-open' || value === 'fe-close' ) {
                            console.error( 'Cannot transmit value "' + value + '" on popup because it is a preserved keyword.' );
                            return;
                        }
                        
                        this.popupObserverTransmitter.next( value );
                    }
                } );
                
                Reflect.defineProperty( this, 'close', {
                    value: () => {
                        this.popupObserverTransmitter.next( 'fe-close' );
                    }
                } );
            }
            
            public popupObserverTransmitter: Subject<any> = new Subject<any>();
        };
    };
}

/*
 https://stackoverflow.com/questions/38763248/angular-2-life-cycle-hook-after-all-children-are-initialized
 */

export class AsynchronouslyInitialisedComponent {
    
    loadedState: Subject<boolean> = new Subject<boolean>();
    
    protected componentLoaded(): void {
        this.loadedState.next( true );
    }
}