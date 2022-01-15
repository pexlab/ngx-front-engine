import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ComponentTheme, FeColorPalette, PartialDropdownTheme, ThemeService } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './dropdown.component.html',
        styleUrls  : [ './dropdown.component.scss' ]
    }
)
export class DropdownComponent implements OnInit {
    
    constructor( private fb: FormBuilder, private theme: ThemeService ) { }
    
    public formGroup = this.fb.group(
        {
            properties: this.fb.array(
                [
                    this.fb.control( null )
                ]
            )
        }
    );
    
    public get properties() {
        return this.formGroup.controls[ 'properties' ] as FormArray;
    }
    
    public defaultTheme: ComponentTheme<PartialDropdownTheme> = {
        palette: {}
    };
    
    public outlineTheme: ComponentTheme<PartialDropdownTheme> = {
        palette: {
            placeholderIdlePanelText      : this.theme.common.palette.accent.primary,
            placeholderIdlePanelBorder    : this.theme.common.palette.accent.primary,
            placeholderIdlePanelBackground: '#EEEEEE'
        }
    };
    
    public ngOnInit(): void {
        this.formGroup.valueChanges.subscribe( ( value ) => {
            if ( this.properties.getRawValue()[ this.properties.getRawValue().length - 1 ] !== null ) {
                this.properties.push( this.fb.control( null ) );
            }
        } );
    }
    
    removeProperty( index: number ) {
        if ( this.properties.length > 1 && this.properties.getRawValue()[ index ] !== null ) {
            this.properties.removeAt( index );
        }
    }
}
