import { Component, OnDestroy, OnInit } from '@angular/core';

@Component(
    {
        templateUrl: './speedometer.component.html',
        styleUrls  : [ './speedometer.component.scss' ]
    }
)
export class SpeedometerComponent implements OnInit, OnDestroy {
    
    constructor() { }
    
    public speedometerValue = 0;
    private interval!: number;
    
    public ngOnInit(): void {
        
        this.interval = setInterval( () => {
            this.setRandom();
        }, 500 );
    }
    
    private setRandom() {
        
        const min = 0;
        const max = 250;
        
        this.speedometerValue = Math.floor( Math.random() * ( max - min + 1 ) + min );
    }
    
    public ngOnDestroy(): void {
        clearInterval( this.interval );
    }
}
