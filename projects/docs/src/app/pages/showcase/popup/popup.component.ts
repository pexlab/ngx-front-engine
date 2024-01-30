import { Component, OnDestroy } from '@angular/core';
import { rem, PopupService } from '@pexlab/ngx-front-engine';
import { Observable } from 'rxjs';
import { NutmegComponent } from '../../../popups/nutmeg/nutmeg.component';

@Component(
    {
        templateUrl: './popup.component.html',
        styleUrls  : [ './popup.component.scss' ]
    }
)
export class PopupComponent implements OnDestroy {

    constructor( private popup: PopupService ) { }

    public transmissions: string[] = [];

    private titleInterval?: number;

    public openPopup(): void {

        const titlesCanChange = new Observable<string>( ( observer ) => {

            observer.next( 'Sample Popup about...' );

            setTimeout( () => {
                observer.next( 'Nutmegs!' );
            }, 2000 );

            this.titleInterval = setInterval( () => {

                observer.next( 'A pungent and a warm, slightly sweet tasting spice' );

                setTimeout( () => {

                    if ( this.titleInterval === undefined ) {
                        return;
                    }

                    observer.next( 'Nutmegs!' );

                }, 2000 );

            }, 4000 );
        } );

        const popup = this.popup.createPopupRef( {
            title    : titlesCanChange,
            component: NutmegComponent,
            size     : {
                width: rem( 30 )
            }
        } );

        popup.onClose( () => {
            if ( this.titleInterval !== undefined ) {
                clearInterval( this.titleInterval );
                this.titleInterval = undefined;
            }
        } );

        popup.onTransmit( ( value ) => {
            this.transmissions.push( String( value ) );
        } );

        popup.open();
    }

    public ngOnDestroy(): void {
        if ( this.titleInterval !== undefined ) {
            clearInterval( this.titleInterval );
            this.titleInterval = undefined;
        }
    }
}
