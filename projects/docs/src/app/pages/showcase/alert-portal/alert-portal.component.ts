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
            title      : 'Not sure?',
            description: 'When in doubt, use this generic alert type.',
            type       : 'generic',
            icon       : 'help'
        },
        {
            title      : 'Emojis!',
            description: 'You can use them instead of an icons as well.',
            type       : 'generic',
            icon       : '✌️'
        },
        {
            title      : 'Did you know?',
            description: 'Here is something might worth pointing out.',
            type       : 'info'
        },
        {
            title      : 'All good',
            description: 'Your request has gone through.',
            type       : 'success'
        },
        {
            title      : 'Caution',
            description: 'A warning has been issued. See the following:',
            code       : 'DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.',
            type       : 'warning'
        },
        {
            title      : 'Damn!',
            description: 'Something has gone wrong.',
            type       : 'error'
        }
    ];

    public ngOnInit(): void {
    }

    public spawn() {

        this.sampleAlerts.forEach( ( a, index ) => {

            setTimeout( () => {

                this.alert.emit( 'showcase', a );

            }, index * 500 );
        } );
    }

    public clear() {
        this.alert.clear( 'showcase' );
    }

    public removeRandom() {

        const activeAlerts = this.alert.getAll( 'showcase' );

        if ( activeAlerts.length > 0 ) {
            const randomAlert = activeAlerts[ Math.floor( ( Math.random() * activeAlerts.length ) ) ];
            randomAlert.remove();
        }
    }
}
