import { Component } from '@angular/core';
import { fes, PopupService } from '@pexlab/ngx-front-engine';
import { NutmegComponent } from '../../../popups/nutmeg/nutmeg.component';

@Component(
    {
        templateUrl: './popup.component.html',
        styleUrls  : [ './popup.component.scss' ]
    }
)
export class PopupComponent {

    constructor( private popup: PopupService ) { }

    public transmissions: string[] = [];

    public openPopup(): void {

        const popup = this.popup.createPopup( 'Sample Popup about Nutmegs' );

        popup.onTransmit( ( value ) => {
            this.transmissions.push( String( value ) );
        } );

        popup.open( NutmegComponent, undefined, { width: fes( 30 ) } );
    }
}
