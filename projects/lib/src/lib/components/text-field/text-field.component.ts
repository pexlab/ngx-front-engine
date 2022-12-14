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
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';
import { nanoid } from 'nanoid';
import { parsePath, roundCommands } from 'svg-round-corners';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeService } from '../../theme/theme.service';
import { AsynchronouslyInitialisedComponent, FeComponent } from '../../utils/component.utils';
import { elementWidthWithoutPadding } from '../../utils/element.utils';
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
        private aligner: LabelAlignerService,
        private theme: ThemeService
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

    @ViewChild( 'placeholderMeasurement' )
    private placeholderMeasurementRef!: ElementRef<HTMLSpanElement>;

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
                /*
                 * To check if user clicked outside the field to blur it */
                this.renderer.listen( this.hostElement.nativeElement, 'pointerdown', () => {
                    this.discardNextUp = true;
                } ),
                this.renderer.listen( this.hostElement.nativeElement, 'pointerup', () => {
                    this.localMouseUp = true;
                } ),
                this.renderer.listen( document.documentElement, 'pointerup', () => {

                    if ( !this.localMouseUp && !this.discardNextUp && this.isFocused ) {
                        this.inputRef?.blur();
                    }

                    this.discardNextUp = false;
                    this.localMouseUp  = false;
                } ),

                /* Enter action */
                this.renderer.listen( this.inputRef, 'keydown', ( event: KeyboardEvent ) => {

                    if ( event.key === 'Enter' ) {

                        if ( this.feType === 'multi' ) {
                            return;
                        }

                        if ( this.feEnterAction === 'next' ) {

                            event.preventDefault();
                            event.stopPropagation();

                            const ownKey = this.ngControl.name;
                            const parent = this.ngControl.control?.parent;

                            if ( ownKey && parent instanceof FormGroup ) {

                                const index = Object.keys( parent.controls ).indexOf( String( ownKey ) );

                                if ( isNaN( index ) ) {
                                    return;
                                }

                                const nextControl = parent.controls[ Object.keys( parent.controls )[ ( index + 1 ) > Object.keys( parent.controls ).length - 1 ? 0 : index + 1 ] ] as any;

                                if ( nextControl?.component?.focusControl ) {
                                    nextControl.component.focusControl();
                                } else if ( nextControl?.component?.inputRef?.focus ) {
                                    nextControl.component.inputRef.focus();
                                } else if ( nextControl?.component?.inputRef?.nativeElement?.focus ) {
                                    nextControl.component.inputRef.nativeElement.focus();
                                }
                            }

                        } else if ( typeof this.feEnterAction === 'function' ) {

                            event.preventDefault();
                            event.stopPropagation();

                            this.ngZone.run( () => {
                                if ( typeof this.feEnterAction === 'function' ) {
                                    this.feEnterAction();
                                }
                            } );
                        }
                    }
                } ),

                /* For mouse only (don't wait for mouse button to go up again) */
                this.renderer.listen(
                    this.fieldRef.nativeElement,
                    'mousedown',
                    ( event: MouseEvent ) => this.focus( event, 'down' )
                ),

                /* For non-mouse devices */
                this.renderer.listen(
                    this.fieldRef.nativeElement,
                    'click',
                    ( event: MouseEvent ) => this.focus( event, 'click' )
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

    private discardNextUp = false;
    private localMouseUp  = false;

    public inputRef?: HTMLInputElement | HTMLTextAreaElement;

    public formControlRef!: FormControl;

    @ContentChild( TemplateRef )
    public template!: TemplateRef<ElementRef>;

    /* Inputs */

    @Input()
    public feTheme!: ComponentTheme<PartialTextFieldTheme>;

    @Input()
    public feType: 'single'
                   | 'multi'
                   | 'date'
                   | 'datetime'
                   | 'date-picker'
                   | 'datetime-picker'
                   | 'time'
                   | 'month'
                   | 'week'
                   | 'email'
                   | 'number'
                   | 'search'
                   | 'tel'
                   | 'url'
                   | 'username'
                   | 'new-password'
                   | 'current-password' = 'single';

    @Input()
    public fePlaceholder: string | [ string, string ] = '';

    @Input()
    public feLabel?: string;

    @Input()
    public fePrefill?: string;

    @Input()
    public feKey?: string;

    @Input()
    public feStatic?: boolean | '' = undefined;

    @Input()
    public feSpellcheck = false;

    @Input()
    public feInputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

    @Input()
    public feConceal?: boolean;

    @Input()
    public feMonospace?: boolean;

    @Input()
    public feEnterAction: 'next' | ( () => void ) | 'none' = 'next';

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

    @Input()
    public set feDisabled( value: boolean ) {
        this.setDisabledState( value );
    }

    @Output()
    public feChange = new EventEmitter();

    /* Used by the group directive */
    public set labelWidth( value: string ) {
        this.hostElement.nativeElement.style.setProperty( '--label-width', value );
    }

    public fieldId = nanoid();

    public idleBorderPath!: string;
    public focusedBorderPath!: string;

    public alignInstance?: string;
    public alignId = nanoid();

    /* Used to populate the field on initialisation.
     For example when the type changes from 'single' to 'multi' the value from before will be recovered.
     Or when the value is set before the field has been fully initialised it will catch up through this variable. */
    private initialisationValue = '';

    private viewInit = false;

    public isFocused           = false;
    public isDisabled          = false;
    public isConcealed         = true;
    public isPlaceholderPinned = false;

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

    public get displayPlaceholder(): string {
        if ( typeof this.fePlaceholder === 'string' ) {
            return this.fePlaceholder;
        } else {
            return this.isPlaceholderPinned ? this.fePlaceholder[ 1 ] : this.fePlaceholder[ 0 ];
        }
    }

    public get measurePlaceholder(): string {
        if ( typeof this.fePlaceholder === 'string' ) {
            return this.fePlaceholder;
        } else {
            return this.fePlaceholder[ 1 ];
        }
    }

    public get nativeType(): string {
        switch ( this.feType ) {

            case 'single':
            case 'multi':
            case 'username':
                return 'text';

            case 'new-password':
            case 'current-password':
                return 'password';

            case 'date':
            case 'date-picker':
                return 'date';

            case 'datetime':
            case 'datetime-picker':
                return 'datetime-local';

            default:
                return this.feType;
        }
    }

    public get nativeInputMode(): string {

        if ( this.feInputMode ) {
            return this.feInputMode;
        }

        switch ( this.feType ) {

            case 'username':
            case 'email':
                return 'email';

            case 'number':
                return 'numeric';

            case 'tel':
                return 'tel';

            case 'url':
                return 'url';

            case 'search':
                return 'search';

            default:
                return 'text';
        }
    }

    private mainResizeObserver!: ResizeObserver;
    private labelResizeObserver!: ResizeObserver;

    public ngOnInit(): void {

        this.mainResizeObserver = new ResizeObserver( () => {
            setTimeout( () => {
                this.considerBorderPath();
                this.considerPlaceholder();
                this.change.detectChanges();
            } );
        } );

        this.labelResizeObserver = new ResizeObserver( () => {
            if ( this.alignInstance ) {
                this.aligner.observeWidth( this.alignInstance, this.alignId );
            }
        } );
    }

    public ngAfterViewInit(): void {

        this.viewInit = true;

        if ( this.alignInstance ) {
            this.aligner.register( this.alignInstance, this.alignId, this );
        }

        this.mainResizeObserver.observe( this.fieldRef.nativeElement );
        this.labelResizeObserver.observe( this.measurementRef.nativeElement );

        /* Initialise style */
        this.applyClasses( true );

        this.componentLoaded();

        this.change.detectChanges();
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

        if ( this.placeholderRef ) {
            if (
                (
                    this.isStatic &&
                    this.value.length > 0
                ) ||
                (
                    this.isStatic &&
                    this.isFocused &&
                    (
                        this.nativeType === 'date' ||
                        this.nativeType === 'datetime-local' ||
                        this.nativeType === 'time' ||
                        this.nativeType === 'month' ||
                        this.nativeType === 'week'
                    )
                )
            ) {
                this.renderer.addClass( this.placeholderRef.nativeElement, 'hidden' );
            } else {
                this.renderer.removeClass( this.placeholderRef.nativeElement, 'hidden' );
            }
        }
    }

    /* Events */

    private onFocusIn(): void {

        /* Only if focusing the input has succeeded */
        if ( document.activeElement !== this.inputRef ) {
            return;
        }

        if ( this.isFocused ) {
            return;
        }

        this.isFocused = true;

        this.considerPlaceholder();
        this.considerBorderPath();
        this.applyClasses( false );

        if ( ( this.feType === 'date-picker' || this.feType === 'datetime-picker' ) && 'showPicker' in HTMLInputElement.prototype ) {
            ( this.inputRef as any ).showPicker();
        }

        this.change.detectChanges();

        if ( this.isDisabled ) {

            /* Select text */
            this.inputRef.select();

        } else {

            /* Announce focus changes */
            this.ngZone.run( () => {} );
        }
    }

    private onFocusOut(): void {

        if ( !this.isFocused ) {
            return;
        }

        this.isFocused = false;

        this.considerPlaceholder();
        this.considerBorderPath();
        this.applyClasses( false );

        this.change.detectChanges();

        /* Announce focus changes */
        this.ngZone.run( () => {
            if ( this.formBlurEvent ) {
                this.formBlurEvent();
            }
        } );
    }

    private onInput( value: string ): void {

        if ( this.isDisabled ) {
            return;
        }

        this.initialisationValue = value;

        this.considerPlaceholder();
        this.considerBorderPath();
        this.applyClasses( false );

        /* Announce input changes */
        this.ngZone.run( () => {

            if ( this.formInputEvent ) {
                this.formInputEvent( value.length > 0 ? value : null );
            }

            this.feChange.next( value );

            this.change.detectChanges();
        } );
    }

    /* Action functions */

    private focus( event: MouseEvent, type: 'down' | 'click' ): void {

        if ( type === 'click' && !event.isTrusted ) {
            return;
        }

        /* Note: As the focusing will later on dispatch the focusIn event, changeDetection is not needed here */

        const path = event.composedPath()[ 0 ] as HTMLElement;

        if ( path.tagName === 'INPUT' || path.tagName === 'TEXTAREA' ) {

            /* User clicked the input element. */
            return;

        } else {

            /* User clicked outside the input element, but still inside the component. */

            if ( this.isFocused ) {
                /* This causes the browser to lose focus. The component will focus the input again so don't even show the blur animation. */
                event.preventDefault();
                return;
            }

            if ( type === 'down' ) {

                /* Without the timeout the browser loses the focus anyway */
                setTimeout( () => {
                    if ( this.inputRef ) {
                        this.inputRef.focus();
                    }
                } );

            } else {

                if ( this.inputRef ) {
                    this.inputRef.focus();
                }
            }
        }
    }

    private considerPlaceholder(): void {

        if ( !this.placeholderRef || this.isStatic ) {
            this.unpinPlaceholder();
            return;
        }

        if ( this.value.length > 0 ) {
            this.pinPlaceholder();
            return;
        }

        if ( this.isFocused && !this.isDisabled ) {
            this.pinPlaceholder();
            return;
        }

        this.unpinPlaceholder();
    }

    private considerBorderPath(): void {

        if ( !this.placeholderRef || this.isStatic ) {
            this.idleBorderPath    = this.generateBorderPath( true );
            this.focusedBorderPath = this.generateBorderPath( true );
            return;
        }

        if ( this.value.length > 0 ) {
            this.idleBorderPath    = this.generateBorderPath( false );
            this.focusedBorderPath = this.generateBorderPath( false );
            return;
        }

        if ( !this.isDisabled ) {
            this.idleBorderPath    = this.generateBorderPath( true );
            this.focusedBorderPath = this.generateBorderPath( false );
            return;
        }

        this.idleBorderPath    = this.generateBorderPath( true );
        this.focusedBorderPath = this.generateBorderPath( true );
    }

    private pinPlaceholder(): void {

        this.isPlaceholderPinned = true;

        if ( !this.isStatic && ( !this.isDisabled || this.value.length > 0 ) ) {

            if ( this.placeholderRef && this.placeholderMeasurementRef ) {

                const gap     = ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 1.25 ) / 16 );
                const padding = ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 0.63 ) / 16 );

                const offsetX = ( this.inputContainerRef.nativeElement.offsetLeft - gap - padding ) * ( -1 );
                const offsetY = ( (
                    this.placeholderMeasurementRef.nativeElement.getBoundingClientRect().height / 2
                ) + 1 ) * ( -1 );

                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', offsetX + 'px' );
                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', offsetY + 'px' );
            }
        }
    }

    private unpinPlaceholder(): void {

        this.isPlaceholderPinned = false;

        if ( this.placeholderRef ) {

            const fieldCenter = ( this.fieldRef.nativeElement.clientHeight / 2 ) - ( this.placeholderRef.nativeElement.clientHeight / 2 );
            const paddingTop  = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingTop;
            const paddingLeft = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingLeft;

            /* Leave some space (2px) for the text-caret. Otherwise, the placeholder will be directly on top of the caret */
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', 'calc(' + paddingLeft + ' + 2px)' );
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', ( this.feType === 'multi' ? paddingTop : fieldCenter + 'px' ) );
        }
    }

    private generateBorderPath( closed: boolean ): string {

        if ( !this.hostElement?.nativeElement?.clientWidth ) {
            return '';
        }

        const strokeWidth = ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 0.13 ) / 16 );
        const m           = strokeWidth / 2;

        let placeholderWidth = 0;

        if ( !this.isStatic && this.placeholderMeasurementRef ) {
            placeholderWidth = elementWidthWithoutPadding( this.placeholderMeasurementRef.nativeElement );
        }

        const padding = ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 0.63 ) / 16 );

        const gapStart = ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 1.25 ) / 16 );
        const gapEnd   = placeholderWidth > ( this.hostElement.nativeElement.clientWidth - gapStart - ( padding * 2 ) ) ?
                         this.hostElement.nativeElement.clientWidth - gapStart :
                         gapStart + placeholderWidth - m + (
                                 padding * 2
                             );

        const w = this.hostElement.nativeElement.clientWidth - ( strokeWidth / 2 );
        const h = this.hostElement.nativeElement.clientHeight - ( strokeWidth ) + 0.5;

        const path = `M${ gapEnd },${ m } L${ w },${ m } L${ w },${ h } L${ m },${ h } L${ m },${ m } L${ gapStart },${ m }`;

        return roundCommands(
            parsePath( closed || !this.fePlaceholder ? path + ' z' : path ),
            ( 16 * this.theme.common.scale ) * ( Math.round( 16 * 0.63 ) / 16 ),
            2
        ).path;
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
