import { Component, OnInit } from '@angular/core';

@Component(
    {
        selector   : 'docs-input-text',
        templateUrl: './text-field.component.html',
        styleUrls  : [ './text-field.component.scss' ]
    }
)

export class TextFieldComponent implements OnInit {
    
    constructor() { }
    
    ngOnInit(): void {
    }
}
