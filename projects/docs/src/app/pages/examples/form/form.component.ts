import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component(
    {
        templateUrl: './form.component.html',
        styleUrls  : [ './form.component.scss' ]
    }
)
export class FormComponent implements OnInit {
    
    constructor() { }
    
    public exampleForm = new FormGroup(
        {
            firstName: new FormControl( '' ),
            lastName : new FormControl( '' )
        }
    );
    
    public type: 'single' | 'multi' = 'single';
    
    ngOnInit(): void {
    }
    
    public updateName(): void {
        this.exampleForm.setValue(
            {
                firstName: 'Nancy',
                lastName : 'Pelosi'
            }
        );
    }
    
    public changeType(): void {
        if ( this.type === 'single' ) {
            this.type = 'multi';
        } else {
            this.type = 'single';
        }
    }
}
