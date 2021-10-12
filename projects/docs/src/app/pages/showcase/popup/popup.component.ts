import { Component } from '@angular/core';
import { PopupService } from '@pexlab/ngx-front-engine';
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
        
        const popup = this.popup.createPopup( 'Test' );
        
        popup.onTransmit( ( value ) => {
            this.transmissions.push( String( value ) );
        } );
        
        popup.open( NutmegComponent, undefined, 450 );
    }
}
