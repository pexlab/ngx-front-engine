import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component(
    {
        templateUrl: './text-field.component.html',
        styleUrls  : [ './text-field.component.scss' ]
    }
)

export class TextFieldComponent implements OnInit {

    constructor( private fb: FormBuilder ) { }

    public formGroup!: FormGroup;

    public ngOnInit(): void {
        this.formGroup = this.fb.group(
            {
                moving_placeholder       : null,
                disappearing_placeholder : null,
                custom_label             : null,
                disabled_with_placeholder: this.fb.control(
                    {
                        value   : null,
                        disabled: true
                    }
                ),
                disabled_with_prefill    : this.fb.control(
                    {
                        value   : 'This field\'s content cannot be edited',
                        disabled: true
                    }
                ),
                area                     : null
            }
        );
    }
}
