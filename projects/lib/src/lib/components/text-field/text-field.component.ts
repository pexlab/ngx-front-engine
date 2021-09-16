import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    Input, NgZone, OnDestroy, OnInit, Optional,
    QueryList,
    Renderer2, Self,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { parsePath, roundCommands } from '@twixes/svg-round-corners';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { AsynchronouslyInitialisedComponent, FeComponent } from '../../utils/component.utils';

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
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
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
    
    @ViewChild( 'normalBorder' )
    private normalBorderRef!: ElementRef<HTMLElement>;
    
    @ViewChild( 'focusBorder' )
    private focusBorderRef!: ElementRef<HTMLElement>;
    
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
    
    /* Used by the group directive */
    public set labelWidth( value: string ) {
        this.hostElement.nativeElement.style.setProperty( '--label-width', value );
    }
    
    public normalBorderPath!: string;
    public focusBorderPath!: string;
    
    /* Used to populate the field on initialisation.
     For example when the type changes from 'single' to 'multi' the value from before will be recovered.
     Or when the value is set before the field has been fully initialised it will catch up through this variable. */
    private initialisationValue = '';
    
    private isFocused                  = false;
    private skipNextFocusBlurAnimation = false;
    
    private disposeListeners: ( () => void )[] = [];
    
    /* Form API */
    private formInputEvent?: ( value: string ) => void;
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
    
    private resizeObserver!: ResizeObserver;
    
    public ngOnInit(): void {
        this.resizeObserver = new ResizeObserver( () => {
            this.considerBorderPath();
            this.cdr.detectChanges();
        } );
    }
    
    public ngAfterViewInit(): void {
        
        this.resizeObserver.observe( this.fieldRef.nativeElement );
        
        /* Initialise style */
        this.unpinPlaceholder(); /* CSS assumes initial unpinned position as well! */
        
        this.componentLoaded();
    }
    
    public ngOnDestroy(): void {
        
        this.resizeObserver.unobserve( this.hostElement.nativeElement );
        
        this.disposeListeners.forEach( dispose => {
            dispose();
        } );
    }
    
    /* Events */
    
    private onFocusIn(): void {
        
        if ( this.isFocused ) {
            return;
        }
        
        this.isFocused = true;
        
        this.renderer.removeClass( this.fieldRef.nativeElement, 'unfocused' );
        this.renderer.addClass( this.fieldRef.nativeElement, 'focused' );
        
        this.pinPlaceholder();
        this.considerBorderPath();
        
        this.cdr.detectChanges();
    }
    
    private onFocusOut(): void {
        
        if ( !this.isFocused || this.skipNextFocusBlurAnimation ) {
            this.skipNextFocusBlurAnimation = false;
            return;
        }
        
        this.isFocused = false;
        
        this.renderer.removeClass( this.fieldRef.nativeElement, 'focused' );
        this.renderer.addClass( this.fieldRef.nativeElement, 'unfocused' );
        
        if ( this.value.length > 0 ) {
            this.pinPlaceholder();
        } else {
            this.unpinPlaceholder();
        }
        
        this.considerBorderPath();
        
        this.cdr.detectChanges();
        
        this.ngZone.run( () => {
            if ( this.formBlurEvent ) {
                this.formBlurEvent(); /* Update the form model on blur */
            }
        } );
    }
    
    private onInput( value: string ): void {
        
        if ( this.placeholderRef ) {
            if ( value.length > 0 && this.isStatic ) {
                this.renderer.addClass( this.placeholderRef.nativeElement, 'hidden' );
            } else {
                this.renderer.removeClass( this.placeholderRef.nativeElement, 'hidden' );
            }
        }
        
        this.initialisationValue = value;
        
        this.ngZone.run( () => {
            if ( this.formInputEvent ) {
                this.formInputEvent( value ); /* Update the form model on input */
            }
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
        
        if ( !this.isStatic ) {
            
            this.renderer.removeClass( this.fieldRef.nativeElement, 'unpinned' );
            this.renderer.addClass( this.fieldRef.nativeElement, 'pinned' );
            
            if ( this.placeholderRef ) {
                
                const offsetX = this.inputContainerRef.nativeElement.offsetLeft - 20 - 10;
                const offsetY = (
                    this.placeholderRef.nativeElement.getBoundingClientRect().height / 2
                ) + 1;
                
                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', '-' + offsetX + 'px' );
                this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', '-' + offsetY + 'px' );
            }
            
        } else {
            this.renderer.removeClass( this.fieldRef.nativeElement, 'pinned' );
            this.renderer.addClass( this.fieldRef.nativeElement, 'unpinned' );
        }
    }
    
    private unpinPlaceholder(): void {
        
        this.renderer.removeClass( this.fieldRef.nativeElement, 'pinned' );
        this.renderer.addClass( this.fieldRef.nativeElement, 'unpinned' );
        
        if ( this.placeholderRef ) {
            
            const paddingTop  = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingTop;
            const paddingLeft = window.getComputedStyle( this.inputContainerRef.nativeElement, null ).paddingLeft;
            
            /* Leave some space (2px) for the text-caret. Otherwise the placeholder will be directly on top of the caret */
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-x', 'calc(' + paddingLeft + ' + 2px)' );
            this.placeholderRef.nativeElement.style.setProperty( '--placeholder-y', paddingTop );
        }
    }
    
    private considerBorderPath(): void {
        
        if ( !this.isStatic && this.placeholderRef ) {
            
            this.normalBorderPath = this.generateBorderPath( this.value.length === 0 );
            this.focusBorderPath  = this.generateBorderPath( false );
            
        } else {
            
            this.normalBorderPath = this.generateBorderPath( true );
            this.focusBorderPath  = this.generateBorderPath( true );
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
        
        const w = this.hostElement.nativeElement.getBoundingClientRect().width + m;
        const h = this.hostElement.nativeElement.getBoundingClientRect().height + m;
        
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
    }
    
    /* TODO: additional method: get multi-line width of label */
    public getSingleLineWidthOfLabel(): number {
        return this.measurementRef.nativeElement.clientWidth;
    }
    
    /* Reactive forms functions */
    
    public writeValue( input: string ): void {
        this.value = input;
    }
    
    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }
    
    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }
}

export const ZTextFieldTheme = z.object(
    {
        idleText      : ZHEXColor,
        idleBorder    : ZHEXColor,
        idleDivider   : ZHEXColor,
        idleBackground: ZHEXColor,
        
        focusText      : ZHEXColor,
        focusBorder    : ZHEXColor,
        focusDivider   : ZHEXColor,
        focusBackground: ZHEXColor,
        
        placeholderPinnedFocused    : ZHEXColor,
        placeholderPinnedUnfocused  : ZHEXColor,
        placeholderUnpinnedFocused  : ZHEXColor,
        placeholderUnpinnedUnfocused: ZHEXColor,
        
        errorText       : ZHEXColor,
        errorPlaceholder: ZHEXColor,
        errorBorder     : ZHEXColor,
        errorDivider    : ZHEXColor,
        errorBackground : ZHEXColor
    }
);

export const ZPartialTextFieldTheme = ZTextFieldTheme.partial();

export type TextFieldTheme = z.infer<typeof ZTextFieldTheme>;
export type PartialTextFieldTheme = z.infer<typeof ZPartialTextFieldTheme>;