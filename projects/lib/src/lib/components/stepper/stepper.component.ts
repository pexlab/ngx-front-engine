import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { PartialStepperTheme } from './stepper.theme';

@Component(
    {
        selector       : 'fe-stepper',
        templateUrl    : './stepper.component.html',
        styleUrls      : [ './stepper.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class StepperComponent extends ThemeableFeComponent implements OnInit, ControlValueAccessor {

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public change: ChangeDetectorRef,
        public hostElement: ElementRef
    ) {

        super();
        this.initializeFeComponent( 'stepper', this );

        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }

    public value!: number;

    /* Form API */
    private formInputEvent?: ( value: number ) => void;
    private formBlurEvent?: () => void;

    @Input()
    public feTheme: ComponentTheme<PartialStepperTheme> | undefined;

    @Input()
    public feMin = 1;

    @Input()
    public feMax = Number.MAX_VALUE;

    @Input()
    public feInline?: boolean | '' = undefined;

    @Input()
    public feSuffix!: ( input: number ) => string;

    @Output()
    public feChange = new EventEmitter();

    @ViewChild( 'top' )
    public topRef!: ElementRef<HTMLElement>;

    /* To simplify the attribute usage */
    @HostBinding( 'class.stepper-inline' )
    private get isInline() {

        if ( this.feInline === undefined ) {
            return false;
        }

        if ( typeof this.feInline === 'string' ) {
            return true;
        }

        return this.feInline;
    }

    public ngOnInit(): void {
        if ( this.value === undefined || this.value === null || isNaN( this.value ) ) {
            this.value = this.feMin;
        }
    }

    public focusControl(): void {
        this.topRef.nativeElement.focus();
    }

    public getSuffix(): string {
        if ( this.feSuffix ) {
            return `'${ this.feSuffix( this.value ) }'`;
        } else {
            return '';
        }
    }

    public add(): void {

        if ( this.value >= this.feMax ) {
            return;
        }

        this.value++;

        if ( this.formInputEvent ) {
            this.formInputEvent( this.value );
        }

        this.feChange.next( this.value );

        this.change.detectChanges();
    }

    public subtract(): void {

        if ( this.value <= this.feMin ) {
            return;
        }

        this.value--;

        if ( this.formInputEvent ) {
            this.formInputEvent( this.value );
        }

        this.feChange.next( this.value );

        this.change.detectChanges();
    }

    /* Reactive forms functions */

    public writeValue( input: any ): void {

        const parsed = +input;

        if ( input === undefined || input === null || isNaN( parsed ) ) {

            /* Invalid value to write, fallback to minimum and dispatch input event back to the forms-api */

            this.value = this.feMin;

            if ( this.formInputEvent ) {
                this.formInputEvent( this.value );
            }

            console.error(
                'Invalid value "' + input + '" to write on stepper component. ' +
                'Only numbers are valid.'
            );

        } else {

            if ( parsed < this.feMin ) {

                this.value = this.feMin;

                if ( this.formInputEvent ) {
                    this.formInputEvent( this.value );
                }

                console.error(
                    'Invalid value "' + input + '" to write on stepper component. ' +
                    'The value is less than the defined minimum.'
                );

            } else if ( parsed > this.feMax ) {

                this.value = this.feMax;

                if ( this.formInputEvent ) {
                    this.formInputEvent( this.value );
                }

                console.error(
                    'Invalid value "' + input + '" to write on stepper component. ' +
                    'The value is greater than the defined maximum.'
                );

            } else {
                this.value = parsed;
            }
        }

        this.feChange.next( this.value );

        this.change.detectChanges();
    }

    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }
}
