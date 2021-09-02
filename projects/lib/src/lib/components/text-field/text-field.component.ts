import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input, NgZone, OnDestroy, OnInit,
    Output,
    QueryList,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
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

export class TextFieldComponent extends AsynchronouslyInitialisedComponent implements OnInit, AfterViewInit, OnDestroy {
    
    constructor(
        public hostElement: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        super();
        hostElement.nativeElement.style.setProperty( '--label-width', 'auto' );
    }
    
    /* ViewChildren */
    
    @ViewChild( 'textField' )
    private field!: ElementRef<HTMLElement>;
    
    @ViewChild( 'label' )
    private label!: ElementRef<HTMLElement>;
    
    @ViewChild( 'measurement' )
    private measurement!: ElementRef<HTMLElement>;
    
    @ViewChild( 'placeholder' )
    private placeholder!: ElementRef<HTMLSpanElement>;
    
    @ViewChild( 'normalBorder' )
    private normalBorder!: ElementRef<HTMLElement>;
    
    @ViewChild( 'focusBorder' )
    private focusBorder!: ElementRef<HTMLElement>;
    
    @ViewChild( 'inputContainer' )
    private inputContainer!: ElementRef<HTMLElement>;
    
    @ViewChildren( 'textInput', { read: ElementRef } )
    private input!: QueryList<ElementRef<HTMLInputElement | HTMLTextAreaElement>>;
    
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
    
    @Output()
    public feOnType = new EventEmitter<string>();
    
    /* Used by the group directive */
    public set labelWidth( value: string ) {
        this.hostElement.nativeElement.style.setProperty( '--label-width', value );
    }
    
    public normalBorderPath!: string;
    public focusBorderPath!: string;
    
    private isFocused                  = false;
    private skipNextFocusBlurAnimation = false;
    
    private disposeListeners: ( () => void )[] = [];
    
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
        
        if ( this.fePrefill ) {
            
            if ( this.feType === 'date' ) {
                (
                    this.input.first.nativeElement as HTMLInputElement
                ).valueAsDate = new Date( this.fePrefill );
            } else {
                this.input.first.nativeElement.value = this.fePrefill;
            }
        }
        
        /* Add listeners that are not supposed to trigger outside view checks */
        this.ngZone.runOutsideAngular( () => {
            
            this.disposeListeners.push(
                this.renderer.listen(
                    this.field.nativeElement,
                    'mousedown',
                    ( event: MouseEvent ) => this.focusField( event )
                ),
                
                this.renderer.listen(
                    this.input.first.nativeElement,
                    'input',
                    () => this.onInput( this.input.first.nativeElement.value )
                ),
                
                this.renderer.listen(
                    this.input.first.nativeElement,
                    'focusin',
                    () => this.onFocusIn()
                ),
                
                this.renderer.listen(
                    this.input.first.nativeElement,
                    'focusout',
                    () => this.onFocusOut()
                )
            );
        } );
        
        this.resizeObserver.observe( this.field.nativeElement );
        
        /* Initialise style */
        this.unpinPlaceholder(); /* CSS assumes initial unpinned position as well! */
        
        /* Enable manual change detection to increase performance */
        this.cdr.detach();
        
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
        
        this.renderer.removeClass( this.field.nativeElement, 'unfocused' );
        this.renderer.addClass( this.field.nativeElement, 'focused' );
        
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
        
        this.renderer.removeClass( this.field.nativeElement, 'focused' );
        this.renderer.addClass( this.field.nativeElement, 'unfocused' );
        
        if ( this.value.length > 0 ) {
            this.pinPlaceholder();
        } else {
            this.unpinPlaceholder();
        }
        
        this.considerBorderPath();
        
        this.validate();
        
        this.cdr.detectChanges();
    }
    
    private onInput( value: string ): void {
        
        if ( this.placeholder ) {
            if ( value.length > 0 && this.isStatic ) {
                this.renderer.addClass( this.placeholder.nativeElement, 'hidden' );
            } else {
                this.renderer.removeClass( this.placeholder.nativeElement, 'hidden' );
            }
        }
        
        /* Only run in angular zone for view checking if event is actually being subscribed to */
        /* TODO: wait for PR https://github.com/ReactiveX/rxjs/issues/5967 */
        if ( this.feOnType.observers.length > 0 ) {
            
            this.ngZone.run( () => {
                this.feOnType.emit( value );
            } );
            
        } else {
            this.feOnType.emit( value ); /* For better conscience I guess */
        }
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
            this.input.first.nativeElement.focus();
        } );
    }
    
    private pinPlaceholder(): void {
        
        if ( !this.isStatic ) {
            
            this.renderer.removeClass( this.field.nativeElement, 'unpinned' );
            this.renderer.addClass( this.field.nativeElement, 'pinned' );
            
            if ( this.placeholder ) {
                
                const offsetX = this.inputContainer.nativeElement.offsetLeft - 20 - 10;
                const offsetY = (
                    this.placeholder.nativeElement.getBoundingClientRect().height / 2
                ) + 1;
                
                this.placeholder.nativeElement.style.setProperty( '--placeholder-x', '-' + offsetX + 'px' );
                this.placeholder.nativeElement.style.setProperty( '--placeholder-y', '-' + offsetY + 'px' );
            }
            
        } else {
            this.renderer.removeClass( this.field.nativeElement, 'pinned' );
            this.renderer.addClass( this.field.nativeElement, 'unpinned' );
        }
    }
    
    private unpinPlaceholder(): void {
        
        this.renderer.removeClass( this.field.nativeElement, 'pinned' );
        this.renderer.addClass( this.field.nativeElement, 'unpinned' );
        
        if ( this.placeholder ) {
            
            const paddingTop  = window.getComputedStyle( this.inputContainer.nativeElement, null ).paddingTop;
            const paddingLeft = window.getComputedStyle( this.inputContainer.nativeElement, null ).paddingLeft;
            
            /* Leave some space (2px) for the text-caret. Otherwise the placeholder will be directly on top of the caret */
            this.placeholder.nativeElement.style.setProperty( '--placeholder-x', 'calc(' + paddingLeft + ' + 2px)' );
            this.placeholder.nativeElement.style.setProperty( '--placeholder-y', paddingTop );
        }
    }
    
    private considerBorderPath(): void {
        
        if ( !this.isStatic && this.placeholder ) {
            
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
        
        if ( this.placeholder ) {
            
            placeholderWidth = this.placeholder.nativeElement.getBoundingClientRect().width;
            
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
        return this.input?.first?.nativeElement?.value || '';
    }
    
    public set value( value: string ) {
        this.input.first.nativeElement.value = value;
    }
    
    /* TODO: additional method: get multi-line width of label */
    public getSingleLineWidthOfLabel(): number {
        return this.measurement.nativeElement.clientWidth;
    }
    
    public validate(): boolean {
        // TODO: implement zod
        this.renderer.removeClass( this.field.nativeElement, 'error' );
        return true;
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