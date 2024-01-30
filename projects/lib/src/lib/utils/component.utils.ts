import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { isEqual } from 'lodash-es';
import { ReplaySubject } from 'rxjs';
import { ComponentTheme, HexColorRegister } from '../interfaces/color.interface';
import { ThemeableComponents } from '../interfaces/theme.interface';
import { ThemeService } from '../theme/theme.service';

/* Constraints */

interface IFeThemeableComponent {
    feTheme: ComponentTheme | undefined,
    hostElement: ElementRef<HTMLElement>,
    change?: ChangeDetectorRef
}

export interface IFePopup {
    close: () => void,
    transmitToHost: ( value: any ) => void
}

export abstract class FeComponent {

    protected constructor() {
    }

    /* https://stackoverflow.com/questions/38763248/angular-2-life-cycle-hook-after-all-children-are-initialized */

    public readonly feRendered: ReplaySubject<boolean> = new ReplaySubject<boolean>( 1 );

    public feOnRenderComplete(): void {
        this.feRendered.next( true );
    }
}

export abstract class ThemeableFeComponent extends FeComponent {

    public _fePreviousPalette: HexColorRegister = {};

    public _feCurrentTheme?: ComponentTheme;

    protected constructor() {
        super();
    }

    protected initializeFeComponent( type: ThemeableComponents, instance: IFeThemeableComponent ) {

        Reflect.defineProperty( instance, 'feTheme', {

            set: ( theme: ComponentTheme | undefined ) => {

                /* TODO: when set undefined remove styling */

                const newPalette: HexColorRegister = theme?.palette || {};

                /* Only apply the palette if it has been changed */
                if ( !isEqual( newPalette, this._fePreviousPalette ) ) {

                    this._fePreviousPalette = newPalette;

                    ThemeService.singleton.applyPalette(
                        {
                            [ type ]: newPalette
                        },
                        instance.hostElement.nativeElement
                    );

                    if ( instance.change?.detectChanges ) {
                        instance.change.detectChanges();
                    }
                }

                this._feCurrentTheme = theme;
            },

            get: () => {
                return this._feCurrentTheme;
            }
        } );
    }
}
