import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Numerals } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './form.component.html',
        styleUrls  : [ './form.component.scss' ]
    }
)
export class FormComponent {
    
    constructor() { }
    
    public commonNumerals = Numerals;
    
    public exampleForm = new FormGroup(
        {
            firstName          : new FormControl(),
            lastName           : new FormControl(),
            gender             : new FormControl(),
            newsletter         : new FormControl(),
            newsletter_interval: new FormControl()
        }
    );
    
    public populate(): void {
        this.exampleForm.setValue(
            {
                firstName          : 'John',
                lastName           : 'Doe',
                gender             : 'male',
                newsletter         : true,
                newsletter_interval: 5
            }
        );
    }
    
    public reset(): void {
        this.exampleForm.reset();
    }
}
