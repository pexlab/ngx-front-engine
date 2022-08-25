import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component(
    {
        templateUrl: './checkbox.component.html',
        styleUrls  : [ './checkbox.component.scss' ]
    }
)

export class CheckboxComponent implements OnInit {

    constructor( private fb: UntypedFormBuilder ) { }

    public formGroup!: UntypedFormGroup;

    public ngOnInit(): void {
        this.formGroup = this.fb.group(
            {
                single  : null,
                label   : null,
                disabled_off: this.fb.control(
                    {
                        value   : false,
                        disabled: true
                    }
                ),
                disabled_on: this.fb.control(
                    {
                        value   : true,
                        disabled: true
                    }
                )
            }
        );
    }
}
