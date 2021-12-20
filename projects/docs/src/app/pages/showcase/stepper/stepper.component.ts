import { Component } from '@angular/core';
import { FeBundledTranslations } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './stepper.component.html',
        styleUrls  : [ './stepper.component.scss' ]
    }
)
export class StepperComponent {
    
    constructor() { }
    
    public numeralTranslations = FeBundledTranslations.Numerals;
}
