import { ElementRef, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentTheme, HEXColor, HEXColorRegister } from '../interfaces/color.interface';
import { ThemeableComponents } from '../interfaces/theme.interface';
import { ThemeService } from '../theme/theme.service';
import { ClassWithProperties } from './type.utils';
import { isEqual } from 'lodash';

export function FeComponent( name: ThemeableComponents ) {
    
    return function <C extends ClassWithProperties<{ feTheme: ComponentTheme, hostElement: ElementRef<HTMLElement> }>>( target: C ): void {
        
        /* Cache to prevent re-applying the same palette */
        let currentPalette: { [ k: string ]: HEXColor } = {};
        
        /* The original onChanges method */
        const forwardMethod = target.prototype.ngOnChanges;
        
        /* Overwrite the onChanges method */
        target.prototype.ngOnChanges = function( changes: SimpleChanges ) {
            
            const palette: HEXColorRegister = this.feTheme?.palette || {};
            
            /* Only apply the palette if it changed */
            if ( !isEqual( currentPalette, palette ) ) {
                
                currentPalette = palette;
                
                ThemeService.singleton.applyPalette(
                    ThemeService.singleton.evaluatePalette(
                        {
                            [ name ]: palette
                        }
                    ),
                    this.hostElement.nativeElement
                );
            }
            
            /* Call the original onChanges method */
            if ( forwardMethod ) {
                forwardMethod.apply( this, [ changes ] );
            }
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