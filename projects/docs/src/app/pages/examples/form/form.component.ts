import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component(
    {
        templateUrl: './form.component.html',
        styleUrls  : [ './form.component.scss' ]
    }
)
export class FormComponent {
    
    constructor() { }
    
    public exampleForm = new FormGroup(
        {
            firstName : new FormControl(),
            lastName  : new FormControl(),
            gender    : new FormControl(),
            newsletter: new FormControl()
        }
    );
    
    public populate(): void {
        this.exampleForm.setValue(
            {
                firstName : 'John',
                lastName  : 'Doe',
                gender    : 'male',
                newsletter: true
            }
        );
    }
    
    public reset(): void {
        this.exampleForm.reset();
    }
}
