import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { parsePath, roundCommands } from 'svg-round-corners';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialCheckboxTheme } from './checkbox.theme';

@FeComponent( 'checkbox' )
@Component(
    {
        selector   : 'fe-checkbox',
        templateUrl: './checkbox.component.html',
        styleUrls  : [ './checkbox.component.scss' ]
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

    @Output()
    public feChange = new EventEmitter();

    public isChecked   = false;
    public initialised = false;

    public idleOutlinePath!: string;
    public hoverOutlinePath!: string;
    public checkedOutlinePath!: string;

    public checkmarkOutlinePath!: string;

    /* Form API */
    private formInputEvent?: ( value: boolean ) => void;
    private formBlurEvent?: () => void; // TODO

    public ngOnInit(): void {

        this.idleOutlinePath    = this.drawBox( 2 );
        this.hoverOutlinePath   = this.drawBox( 2.5 );
        this.checkedOutlinePath = this.drawBox( 1.5 );

        this.checkmarkOutlinePath = this.drawCheckmark();
    }

    public ngAfterViewInit(): void {

        this.change.detach();

        /* Calculate path length */
        this.change.detectChanges();

        this.initialised = true;

        /* Path length has been calculated, it is now safe to show the checkmark */
        this.change.detectChanges();
    }

    @HostListener( 'click' )
    public onClick(): void {

        this.isChecked = !this.isChecked;

        this.feChange.next( this.isChecked );

        if ( this.formInputEvent ) {
            this.formInputEvent( this.isChecked );
        }

        this.change.detectChanges();
    }

    private drawBox( strokeWidth: number ): string {

        const m = strokeWidth / 2;
        const w = 18 - m;
        const h = 18 - m;

        return roundCommands(
            parsePath( `M ${ w },${ h / 2 } L ${ w },${ h } L ${ m },${ h } L ${ m },${ m } L ${ w },${ m } Z` ),
            3,
            4
        ).path;
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
}
