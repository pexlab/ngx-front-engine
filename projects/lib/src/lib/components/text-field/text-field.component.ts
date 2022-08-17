import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    Renderer2,
    Self,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { parsePath, roundCommands } from 'svg-round-corners';
import { nanoid } from 'nanoid';
import { ComponentTheme } from '../../interfaces/color.interface';
import { AsynchronouslyInitialisedComponent, FeComponent } from '../../utils/component.utils';
import { LabelAlignerService } from './label-aligner.service';
import { PartialTextFieldTheme } from './text-field.theme';

@FeComponent( 'textField' )
@Component(
    {
        selector       : 'fe-text-field',
        templateUrl    : './text-field.component.html',
        styleUrls      : [ './text-field.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)

export class TextFieldComponent extends AsynchronouslyInitialisedComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public hostElement: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        public change: ChangeDetectorRef,
        private ngZone: NgZone,
        private aligner: LabelAlignerService
    ) {
        super();
        hostElement.nativeElement.style.setProperty( '--label-width', 'auto' );

        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }

    /* ViewChildren */

    @ViewChild( 'textField' )
    private fieldRef!: ElementRef<HTMLElement>;

    @ViewChild( 'label' )
    private labelRef!: ElementRef<HTMLElement>;

    @ViewChild( 'measurement' )
    private measurementRef!: ElementRef<HTMLElement>;

    @ViewChild( 'placeholder' )
    private placeholderRef!: ElementRef<HTMLSpanElement>;

    @ViewChild( 'idleBorder' )
    private idleBorderRef!: ElementRef<HTMLElement>;

    @ViewChild( 'focusedBorder' )
    private focusedBorderRef!: ElementRef<HTMLElement>;

    @ViewChild( 'inputContainer' )
    private inputContainerRef!: ElementRef<HTMLElement>;

    @ViewChildren( 'textInput', { read: ElementRef } )
    private set inputArrayRef( ref: QueryList<ElementRef<HTMLInputElement | HTMLTextAreaElement>> ) {

        this.inputRef = ref.first.nativeElement;

        if ( this.initialisationValue ) {
            this.value = this.initialisationValue;
        } else if ( this.fePrefill ) {
            this.value = this.fePrefill;
        }

        this.ngZone.runOutsideAngular( () => {

            /* Dispose of possible old listeners */
            this.disposeListeners.forEach( dispose => {
                dispose();
            } );

            /* Add listeners that are not supposed to trigger outside view checks */
            this.disposeListeners.push(
                this.renderer.listen(
                    this.fieldRef.nativeElement,
                    'mousedown',
                    ( event: MouseEvent ) => this.focusField( event )
                ),

                this.renderer.listen(
                    this.inputRef,
                    'input',
                    () => this.onInput( ref.first.nativeElement.value )
                ),

                this.renderer.listen(
                    ref.first.nativeElement,
                    'focusin',
                    () => this.onFocusIn()
                ),

                this.renderer.listen(
                    ref.first.nativeElement,
                    'focusout',
                    () => this.onFocusOut()
                )
            );
        } );
    }

    private inputRef?: HTMLInputElement | HTMLTextAreaElement;

    @ContentChild( TemplateRef )
    public template!: TemplateRef<ElementRef>;

    /* Inputs */

    @Input()
    public feTheme!: ComponentTheme<PartialTextFieldTheme>;

    @Input()
    public feType: 'single' | 'multi' | 'password' | 'date' = 'single';

    @Input()
    public fePlaceholder = '';

    @Input()
    public fePrefill?: string;

    @Input()
    public feKey?: string;

    @Input()
    public feStatic?: boolean | '' = undefined;

    @Input()
    public feSpellcheck = false;

    @Input()
    public set feAlignGroup( value: string | undefined ) {

        if ( value ) {

            if ( this.alignInstance ) {
                this.aligner.unregister( this.alignInstance, this.alignId );
            }

            if ( this.viewInit ) {
                this.aligner.register( value, this.alignId, this );
            }

            this.alignInstance = value;

            return;
        }

        if ( value === undefined && this.alignInstance ) {
            this.aligner.unregister( this.alignInstance, this.alignId );
            this.alignInstance = undefined;
        }
    }

    @Output()
    public feChange = new EventEmitter();

    /* Used by the group directive */
    public set labelWidth( value: string ) {
        this.hostElement.nativeElement.style.setProperty( '--label-width', value );
    }

    public idleBorderPath!: string;
    public focusedBorderPath!: string;

    public alignInstance?: string;
    public alignId = nanoid();

    /* Used to populate the field on initialisation.
     For example when the type changes from 'single' to 'multi' the value from before will be recovered.
     Or when the value is set before the field has been fully initialised it will catch up through this variable. */
    private initialisationValue = '';

    private viewInit = false;

    private isFocused           = false;
    public isDisabled           = false;
    private isPlaceholderPinned = false;

    private skipNextFocusBlurAnimation = false;

    private disposeListeners: ( () => void )[] = [];

    /* Form API */
    private formInputEvent?: ( value: string | null ) => void;
    private formBlurEvent?: () => void;

    /* To simplify the attribute usage */
    private get isStatic() {

        if ( this.feStatic === undefined ) {
            return false;
        }

        if ( typeof this.feStatic === 'string' ) {
            return true;
        }

        return this.feStatic;
    }

    private mainResizeObserver!: ResizeObserver;
    private labelResizeObserver!: ResizeObserver;

    public ngOnInit(): void {

        this.mainResizeObserver = new ResizeObserver( () => {
            this.considerBorderPath();
            this.change.detectChanges();
        } );

        this.labelResizeObserver = new ResizeObserver( () => {
            if ( this.alignInstance ) {
                this.aligner.observeWidth( this.alignInstance, this.alignId );
            }
        } );
    }

    public ngAfterViewInit(): void {

        this.change.detach();

        this.viewInit = true;

        if ( this.alignInstance ) {
            this.aligner.register( this.alignInstance, this.alignId, this );
        }

        this.mainResizeObserver.observe( this.fieldRef.nativeElement );
        this.labelResizeObserver.observe( this.measurementRef.nativeElement );

        /* Initialise style */
        this.unpinPlaceholder(); /* CSS assumes initial static position as well! */

        this.applyClasses( true );

        this.componentLoaded();
    }

    public ngOnDestroy(): void {

        this.mainResizeObserver.unobserve( this.hostElement.nativeElement );
        this.labelResizeObserver.unobserve( this.measurementRef.nativeElement );

        if ( this.alignInstance ) {
            this.aligner.unregister( this.alignInstance, this.alignId );
        }

        this.disposeListeners.forEach( dispose => {
            dispose();
        } );
    }

    private applyClasses( initial: boolean ) {

        this.renderer.removeClass( this.fieldRef.nativeElement, 'initial' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'static' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'pinned' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'idle' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'disabled' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'focused' );
        this.renderer.removeClass( this.fieldRef.nativeElement, 'invalid' );

        if ( initial ) {

            this.renderer.addClass( this.fieldRef.nativeElement, 'initial' );

            setTimeout( () => {
                this.renderer.addClass( this.fieldRef.nativeElement, 'activate_transitions' );
            } );
        }

        if ( this.isStatic ) {
            this.renderer.addClass( this.fieldRef.nativeElement, 'static' );
        } else {
            this.renderer.addClass( this.fieldRef.nativeElement, this.isPlaceholderPinned ? 'pinned' : 'static' );
        }

        if ( this.isFocused ) {
            this.renderer.addClass( this.fieldRef.nativeElement, 'focused' );
        } else {
            this.renderer.addClass( this.fieldRef.nativeElement, 'idle' );
        }

        if ( this.isDisabled ) {
            this.renderer.addClass( this.fieldRef.nativeElement, 'disabled' );
        }
    }

    /* Events */

    private onFocusIn(): void {

        if ( this.isFocused ) {
            return;
        }

        this.isFocused = true;

        this.pinPlaceholder();
        this.considerBorderPath();
        this.applyClasses( false );

        this.change.detectChanges();
    }

    private onFocusOut(): void {

        if ( !this.isFocused || this.skipNextFocusBlurAnimation ) {
            this.skipNextFocusBlurAnimation = false;
            return;
        }

        this.isFocused = false;

        if ( this.value.length > 0 ) {
            this.pinPlaceholder();
        } else {
            this.unpinPlaceholder();
        }

        this.considerBorderPath();

        this.applyClasses( false );

        this.change.detectChanges();

        this.ngZone.run( () => {
            if ( this.formBlurEvent ) {
                this.formBlurEvent(); /* Update the form model on blur */
            }
        } );
    }

    private onInput( value: string ): void {

        if ( this.isDisabled ) {
            return;
        }

        if ( this.placeholderRef ) {
            if ( value.length > 0 && this.isStatic ) {
                this.renderer.addClass( this.placeholderRef.nativeElement, 'hidden' );
            } else {
                this.renderer.removeClass( this.placeholderRef.nativeElement, 'hidden' );
            }
        }

        this.initialisationValue = value;

        this.ngZone.run( () => {

            this.feChange.next( value );

            if ( this.formInputEvent ) {
                this.formInputEvent( value.length > 0 ? value : null ); /* Update the form model on input */
            }

            this.change.detectChanges();
        } );
    }

    /* Action functions */

    private focusField( event: MouseEvent ): void {

        /* Note: As the focusing will later on dispatch the focusIn event, changeDetection is not needed here */

        /* Prevents unnecessary refocusing effect */
        if ( this.isFocused ) {

            const path = event.composedPath()[ 0 ] as HTMLElement;

            if ( path.tagName === 'INPUT' || path.tagName === 'TEXTAREA' ) {

                /* User clicked the input element. Don't take any action. */
                return;

            } else {

                /* User clicked outside of the input element, but still inside the component.
                 * This causes the browser to lose focus. The component will focus the input again further down below this code,
                 * so don't even show the blur animation. */
                this.skipNextFocusBlurAnimation = true;
            }
        }

        /* Without the timeout the browser loses the focus again */
        setTimeout( () => {
            if ( this.inputRef ) {
                this.inputRef.focus();
            }
        } );
    }

    private pinPlaceholder(): void {

        this.isPlaceholderPinned = true;

        if ( !this.isStatic ) {

            if ( this.placeholderRef ) {

                const offsetX = ( this.inputContainerRef.nativeElement.offsetLeft - 20 - 10 ) * ( -1 );
                const offsetY = ( (
                    this.placeholderRef.nativeElement.getBoundingClientRect().height / 2
                ) + 1 ) * ( -1 );

                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', offsetX + 'px' );
                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', offsetY + 'px' );
            }
        }
    }

    private unpinPlaceholder(): void {

        this.isPlaceholderPinned = false;

        if ( this.placeholderRef ) {

            const paddingTop  = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingTop;
            const paddingLeft = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingLeft;

            /* Leave some space (2px) for the text-caret. Otherwise, the placeholder will be directly on top of the caret */
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', 'calc(' + paddingLeft + ' + 2px)' );
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', paddingTop );
        }
    }

    private considerBorderPath(): void {

        if ( !this.isStatic && this.placeholderRef ) {

            this.idleBorderPath    = this.generateBorderPath( this.value.length === 0 );
            this.focusedBorderPath = this.generateBorderPath( false );

        } else {

            this.idleBorderPath    = this.generateBorderPath( true );
            this.focusedBorderPath = this.generateBorderPath( true );
        }
    }

    private generateBorderPath( closed: boolean ): string {

        const strokeWidth = 2;
        const m           = strokeWidth / 2;

        let placeholderWidth = 0;

        if ( this.placeholderRef ) {

            placeholderWidth = this.placeholderRef.nativeElement.getBoundingClientRect().width;

            /* Subtract the padding needed for correct line-breaking when inside the input */
            placeholderWidth -= 20;
        }

        const gapStart = 20;
        const gapEnd   = gapStart + placeholderWidth - m + (
            10 * 2
        );

        const w = this.hostElement.nativeElement.clientWidth - ( strokeWidth / 2 );
        const h = this.hostElement.nativeElement.clientHeight - ( strokeWidth ) + 0.5;

        const path = `M${ gapEnd },${ m } L${ w },${ m } L${ w },${ h } L${ m },${ h } L${ m },${ m } L${ gapStart },${ m }`;

        return roundCommands( parsePath( closed || !this.fePlaceholder ? path + ' z' : path ), 10, 2 ).path;
    }

    /* Public exported functions */

    public get value(): string {
        return this.inputRef?.value || '';
    }

    public set value( value: string ) {

        this.initialisationValue = value;

        if ( this.inputRef ) {

            if ( this.feType === 'date' ) {

                const dateInputRef       = this.inputRef as HTMLInputElement;
                dateInputRef.valueAsDate = new Date( value );

            } else {

                this.inputRef.value = value;
            }
        }

        this.change.detectChanges();
    }

    /* TODO: additional method: get multi-line width of label */
    public getSingleLineWidthOfLabel(): number {
        /* Add 1 because clientWidth rounds the value.
         If it rounds down then there is not sufficient space and line breaks on the label will occur */
        return this.measurementRef.nativeElement.clientWidth + 1;
    }

    /* Reactive forms functions */

    public writeValue( input: string | null ): void {
        this.value = input === null ? '' : input;
        this.change.detectChanges();
    }

    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.isDisabled = isDisabled;
    }
}
