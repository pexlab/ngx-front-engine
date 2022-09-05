import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { parsePath, roundCommands } from 'svg-round-corners';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialCheckboxTheme } from './checkbox.theme';

@FeComponent( 'checkbox' )
@Component(
    {
        selector       : 'fe-checkbox',
        templateUrl    : './checkbox.component.html',
        styleUrls      : [ './checkbox.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)

export class CheckboxComponent implements OnInit, AfterViewInit, ControlValueAccessor {

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public hostElement: ElementRef,
        public change: ChangeDetectorRef
    ) {
        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }

    @Input()
    public feTheme!: ComponentTheme<PartialCheckboxTheme>;

    @Input()
    public feLabel!: string;

    @Input()
    public set feDisabled( value: boolean ) {
        this.setDisabledState( value );
    }

    @Output()
    public feChange = new EventEmitter();

    @ViewChild('wrapper')
    public wrapperRef!: ElementRef<HTMLElement>;

    public isChecked     = false;
    public isInitialised = false;
    public isEnabled     = true;

    public idleOutlinePath!: string;
    public hoverOutlinePath!: string;
    public checkedOutlinePath!: string;
    public backgroundPath!: string;

    public checkmarkOutlinePath!: string;

    /* Form API */
    private formInputEvent?: ( value: boolean ) => void;
    private formBlurEvent?: () => void; // TODO

    public ngOnInit(): void {

        this.idleOutlinePath    = this.drawBox( 2, true );
        this.hoverOutlinePath   = this.drawBox( 2.5, true );
        this.checkedOutlinePath = this.drawBox( 1.5, true );
        this.backgroundPath     = this.drawBox( 2, false );

        this.checkmarkOutlinePath = this.drawCheckmark();
    }

    public ngAfterViewInit(): void {

        /* Calculate path length */
        this.change.detectChanges();

        this.isInitialised = true;

        /* Path length has been calculated, it is now safe to show the checkmark */
        this.change.detectChanges();
    }

    public focusControl(): void {
        this.wrapperRef.nativeElement.focus();
    }

    public onClick(): void {

        if ( !this.isEnabled ) {
            return;
        }

        this.isChecked = !this.isChecked;

        this.feChange.next( this.isChecked );

        if ( this.formInputEvent ) {
            this.formInputEvent( this.isChecked );
        }

        this.change.detectChanges();
    }

    private drawBox( strokeWidth: number, makeGap = false ): string {

        const m = makeGap ? strokeWidth / 2 : 0;
        const w = 18 - m;
        const h = 18 - m;

        if ( makeGap && !this.isEnabled ) {

            /* Leave a small gap in the top right corner for the lock icon */

            const gap = 7 - m;

            return roundCommands(
                parsePath( `M ${ w },${ h / 2 } L ${ w },${ h } L ${ m },${ h } L ${ m },${ m } L ${ w - gap },${ m } M ${ w },${ m + gap } L${ w },${ h / 2 }` ),
                3,
                4
            ).path;

        } else {

            return roundCommands(
                parsePath( `M ${ w },${ h / 2 } L ${ w },${ h } L ${ m },${ h } L ${ m },${ m } L ${ w },${ m } Z` ),
                3,
                4
            ).path;
        }
    }

    private drawCheckmark(): string {

        const strokeWidth = 2;
        const m           = strokeWidth / 2;

        const w = 18 - m;
        const h = 18 - m;

        const d = 4;

        return `M ${ w - d },${ d + 1 } L ${ ( w / 2 ) },${ h - d - 1 } L ${ d + 1 },${ h / 2 + 1 }`;
    }

    public pathLength( element: any ) {
        return element.getTotalLength();
    }

    /* Reactive forms functions */

    public writeValue( input: any ): void {
        this.isChecked = Boolean( input );
        this.feChange.next( this.isChecked );
        this.change.detectChanges();
    }

    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.isEnabled = !isDisabled;
        this.change.detectChanges();
    }
}
