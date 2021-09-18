import { Component, OnInit } from '@angular/core';
import { Alert, AlertPortalService } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './alert-portal.component.html',
        styleUrls  : [ './alert-portal.component.scss' ]
    }
)
export class AlertPortalComponent implements OnInit {
    
    constructor( private alert: AlertPortalService ) { }
    
    private sampleAlerts: Alert[] = [
        {
            title      : 'Info',
            description: 'Point out something to the user.',
            type       : 'info'
        },
        {
            title      : 'Success',
            description: 'Indicate a successful result.',
            type       : 'success'
        },
        {
            title      : 'Warning',
            description: 'Issue a warning.',
            type       : 'warning'
        },
        {
            title      : 'Error',
            description: 'Alert if something has gone wrong.',
            type       : 'error'
        }
    ];
    
    private removeOld: ( () => void )[] = [];
    
    public ngOnInit(): void {
    }
    
    public spawnAlerts() {
        
        this.removeOld.forEach( ( func ) => {
            func();
        } );
        
        this.sampleAlerts.forEach( ( a, index ) => {
            
            setTimeout( () => {
                
                this.removeOld.push( this.alert.emit( 'example', a ) );
                
            }, index * 500 );
        } );
    }
}
