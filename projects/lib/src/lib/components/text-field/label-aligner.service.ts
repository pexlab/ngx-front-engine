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
    private greatestLabelWidth: { [ key: string ]: number }                          = {};
    
    public register( instance: string, id: string, reference: TextFieldComponent ) {
        
        if ( this.references[ instance ] === undefined ) {
            this.references[ instance ] = {};
        }
        
        if ( this.labelWidth[ instance ] === undefined ) {
            this.labelWidth[ instance ] = {};
        }
        
        this.references[ instance ][ id ] = reference;
        
        this.updateWidth( instance, id );
    }
    
    public updateWidth( instance: string, id: string ) {
        
        const width = this.references[ instance ][ id ].getSingleLineWidthOfLabel();
        
        this.labelWidth[ instance ][ id ] = width;
        
        if ( width !== this.greatestLabelWidth[ instance ] ) {
            this.updateAll( instance );
        }
    }
    
    public updateAll( instance: string ) {
    
        console.log('update');
        
        const currentGreatest = this.greatestLabelWidth[ instance ];
        const trulyGreatest   = this.getGreatestLabelWidth( instance );
        
        if ( trulyGreatest !== currentGreatest ) {
            
            this.greatestLabelWidth[ instance ] = trulyGreatest;
            
            /* Apply label width to all labels in the group */
            Object.values( this.references[ instance ] ).forEach( ( reference ) => {
                reference.labelWidth = 'minmax(auto, ' + trulyGreatest + 'px)';
            } );
        }
    }
    
    public unregister( instance: string, id: string ) {
        
        delete this.references[ instance ][ id ];
        delete this.labelWidth[ instance ][ id ];
        
        this.updateAll( instance );
    }
    
    public getGreatestLabelWidth( instance: string ): number {
        return Math.max( ...Object.values( Object.values( this.labelWidth[ instance ] ) ) );
    }
}
