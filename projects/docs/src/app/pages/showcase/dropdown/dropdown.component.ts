import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { ComponentTheme, PartialDropdownTheme, ThemeService } from '@pexlab/ngx-front-engine';
import { Subscription } from 'rxjs';

@Component(
    {
        templateUrl: './dropdown.component.html',
        styleUrls  : [ './dropdown.component.scss' ]
    }
)
export class DropdownComponent implements OnInit, OnDestroy {

    constructor( private fb: UntypedFormBuilder, private theme: ThemeService, private change: ChangeDetectorRef ) { }

    public disabled = this.fb.control( { value: null, disabled: true } );

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
        return this.formGroup.controls[ 'properties' ] as UntypedFormArray;
    }

    public defaultTheme: ComponentTheme<PartialDropdownTheme> = {
        palette: {}
    };

    public outlineTheme: ComponentTheme<PartialDropdownTheme> = {
        palette: {
            placeholderIdlePanelText      : this.theme.common.palette.accent.primary,
            placeholderIdlePanelBorder    : this.theme.common.palette.accent.primary,
            placeholderIdlePanelBackground: '#eeeeee'
        }
    };

    private formGroupSubscription!: Subscription;

    public ngOnInit(): void {
        this.formGroupSubscription = this.formGroup.valueChanges.subscribe( ( value ) => {
            if ( this.properties.getRawValue()[ this.properties.getRawValue().length - 1 ] !== null ) {
                this.properties.push( this.fb.control( null ) );
            }
        } );
    }

    public ngOnDestroy(): void {
        this.formGroupSubscription.unsubscribe();
    }

    public removeProperty( index: number ) {
        if ( this.properties.length > 1 && this.properties.getRawValue()[ index ] !== null ) {
            this.properties.removeAt( index );
        }
    }
}
