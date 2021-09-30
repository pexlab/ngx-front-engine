import { Injectable } from '@angular/core';
import { TextFieldComponent } from './text-field.component';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class LabelAlignerService {
    
    constructor() { }
    
    private references: { [ key: string ]: { [ key: string ]: TextFieldComponent } } = {};
    private labelWidth: { [ key: string ]: { [ key: string ]: number } }             = {};
    
    public register( instance: string, id: string, reference: TextFieldComponent ) {
        
        if ( this.references[ instance ] === undefined ) {
            this.references[ instance ] = {};
        }
        
        if ( this.labelWidth[ instance ] === undefined ) {
            this.labelWidth[ instance ] = {};
        }
        
        this.references[ instance ][ id ] = reference;
        
        this.observeWidth( instance, id );
    }
    
    public observeWidth( instance: string, id: string ) {
        
        const observedWidth = this.references[ instance ][ id ].getSingleLineWidthOfLabel();
        const currentWidth  = this.labelWidth[ instance ][ id ];
        
        if ( currentWidth !== observedWidth ) {
            this.labelWidth[ instance ][ id ] = observedWidth;
            this.adjustAll( instance );
        }
    }
    
    public adjustAll( instance: string ) {
        
        const greatest = this.getGreatestLabelWidth( instance );
        
        /* Apply label width to all labels in the group */
        Object.values( this.references[ instance ] ).forEach( ( reference ) => {
            reference.labelWidth = 'minmax(auto, ' + greatest + 'px)';
        } );
    }
    
    public unregister( instance: string, id: string ) {
        
        delete this.references[ instance ][ id ];
        delete this.labelWidth[ instance ][ id ];
        
        this.adjustAll( instance );
    }
    
    public getGreatestLabelWidth( instance: string ): number {
        return Math.max( ...Object.values( Object.values( this.labelWidth[ instance ] ) ) );
    }
}
