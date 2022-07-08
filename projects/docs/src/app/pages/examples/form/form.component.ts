import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FeBundledTranslations } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './form.component.html',
        styleUrls  : [ './form.component.scss' ]
    }
)
export class FormComponent {
    
    constructor() { }
    
    public numeralTranslations = FeBundledTranslations.Numerals;
    
    public exampleForm = new UntypedFormGroup(
        {
            firstName          : new UntypedFormControl( '' ),
            lastName           : new UntypedFormControl( '' ),
            gender             : new UntypedFormControl( null ),
            newsletter         : new UntypedFormControl( false ),
            newsletter_interval: new UntypedFormControl( 1 ),
            billing_rate       : new UntypedFormControl( 'fixed' )
        }
    );
    
    public populate(): void {
        this.exampleForm.setValue(
            {
                firstName          : 'John',
                lastName           : 'Doe',
                gender             : 'male',
                newsletter         : true,
                newsletter_interval: 5,
                billing_rate       : 'hourly'
            }
        );
    }
    
    public reset(): void {
        this.exampleForm.reset(
            {
                firstName          : '',
                lastName           : '',
                gender             : null,
                newsletter         : false,
                newsletter_interval: 1,
                billing_rate       : 'fixed'
            }
        );
    }
}
