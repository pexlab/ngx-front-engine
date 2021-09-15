import { Component, OnInit } from '@angular/core';
import { Numerals } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './stepper.component.html',
        styleUrls  : [ './stepper.component.scss' ]
    }
)
export class StepperComponent {
    
    constructor() { }
    
    public commonNumerals = Numerals;
}
