import { EventEmitter, Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { Alert, TaggedAlert } from './alert-portal.component';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class AlertPortalService {
    
    public channel: EventEmitter<{ instanceName: string, alerts: TaggedAlert[] }> = new EventEmitter();
    
    private storage: {
        [ p: string ]: { [ key: string ]: Alert },
    } = {};
    
    public transform( input: { [ key: string ]: Alert } | undefined ): TaggedAlert[] {
        return Object.entries( input || {} ).map( ( value ) => {
            return {
                ...value[ 1 ],
                ...{
                    id: value[ 0 ]
                }
            };
        } );
    }
    
    public getAll( instanceName: string ): TaggedAlert[] {
        return this.transform( this.storage[ instanceName ] );
    }
    
    public emit( instanceName: string, alert: Alert ): () => void {
        
        const id = nanoid();
        
        this.storage[ instanceName ] = {
            ...this.storage[ instanceName ] || {},
            ...{
                [ id ]: alert
            }
        };
        
        this.emitNew( instanceName );
        
        return () => {
            
            delete this.storage[ instanceName ][ id ];
            
            this.emitNew( instanceName );
        };
    }
    
    public clear( instanceName: string ): void {
        
        this.storage[ instanceName ] = {};
        
        this.emitNew( instanceName );
    }
    
    private emitNew( instanceName: string ): void {
        this.channel.emit( { instanceName, alerts: this.transform( this.storage[ instanceName ] ) } );
    }
}
