import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component(
    {
        templateUrl: './text-field.component.html',
        styleUrls  : [ './text-field.component.scss' ]
    }
)

export class TextFieldComponent implements OnInit {

    constructor( private fb: UntypedFormBuilder ) { }

    public formGroup!: UntypedFormGroup;

    public ngOnInit(): void {
        this.formGroup = this.fb.group(
            {

                moving                   : null,
                large                    : null,
                changing                 : null,
                disappearing             : null,
                label_moving             : null,
                label_disappearing       : null,
                monospace                : null,
                hidden                   : null,
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

                single: null,
                multi : null,

                date           : null,
                datetime       : null,
                date_picker    : null,
                datetime_picker: null,
                time           : null,
                month          : null,
                week           : null,

                email : null,
                number: null,
                search: null,
                tel   : null,
                url   : null,

                username        : null,
                current_password: null,
                new_password    : null
            }
        );
    }
}
