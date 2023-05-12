import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { PartialSwitchTheme } from './switch.theme';

@Component(
    {
        selector       : 'fe-switch',
        templateUrl    : './switch.component.html',
        styleUrls      : [ './switch.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class SwitchComponent extends ThemeableFeComponent implements OnInit, ControlValueAccessor {

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public hostElement: ElementRef,
        public change: ChangeDetectorRef
    ) {

        super();
        this.initializeFeComponent( 'switch', this );

        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }

    @Input()
    public feTheme: ComponentTheme<PartialSwitchTheme> | undefined;

    @Input()
    public feAppearance: 'minimal' | 'traditional' = 'minimal';

    @Input()
    public feValues: [ string, string ] | [ boolean, boolean ] = [ false, true ];

    @Input()
    public feLabelLeft?: string;

    @Input()
    public feLabelRight?: string;

    @Input()
    public feIconLeft?: string;

    @Input()
    public feIconRight?: string;

    @Output()
    public feChange = new EventEmitter();

    @ViewChild( 'switch' )
    public switchRef!: ElementRef<HTMLElement>;

    /* Form API */
    private formInputEvent?: ( value: string | boolean ) => void;
    private formBlurEvent?: () => void;

    public positionIndex: 0 | 1 = 0;

    public ngOnInit(): void {

        if ( ( this.feIconLeft || this.feIconRight ) && this.feAppearance !== 'traditional' ) {
            throw new Error( 'Icons are only available on the traditional appearance' );
        }
    }

    public focusControl(): void {
        this.switchRef.nativeElement.focus();
    }

    public toggle( position?: 0 | 1 ): void {

        if ( position !== undefined ) {

            this.positionIndex = position;

        } else {

            if ( this.positionIndex === 0 ) {
                this.positionIndex = 1;
            } else {
                this.positionIndex = 0;
            }
        }

        if ( this.formInputEvent ) {
            this.formInputEvent( this.feValues[ this.positionIndex ] );
        }

        this.feChange.next( this.feValues[ this.positionIndex ] );

        this.change.detectChanges();
    }

    public get position(): 'left' | 'right' {
        return this.positionIndex === 0 ? 'left' : 'right';
    }

    /* Reactive forms functions */

    public writeValue( input: any ): void {

        if ( typeof input === 'boolean' || typeof input === 'string' ) {

            const index = this.feValues.findIndex( ( comparison ) => comparison === input );

            if ( isNaN( index ) || !( index === 0 || index === 1 ) ) {
                throw new Error(
                    'Invalid value "' + input + '" to write on switch component.' +
                    'Valid values are: ' + this.feValues.toString()
                );
            } else {
                this.positionIndex = index;
            }

        } else if ( typeof input === 'number' && ( input === 0 || input === 1 ) ) {

            this.positionIndex = input;

        } else {
            throw new Error( 'Invalid value "' + input + '" to write on switch component.' );
        }

        this.feChange.next( this.feValues[ this.positionIndex ] );

        this.change.detectChanges();
    }

    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }
}

export type SwitchInputValue = 'left' | 'right';
