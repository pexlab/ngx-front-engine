import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    Renderer2,
    Self,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { DropdownChoiceComponent } from './choice/dropdown-choice.component';
import { PartialDropdownTheme } from './dropdown.theme';

@FeComponent( 'dropdown' )
@Component(
    {
        selector       : 'fe-dropdown',
        templateUrl    : './dropdown.component.html',
        styleUrls      : [ './dropdown.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations     : [
            trigger( 'options', [

                state( 'hidden', style(
                    {
                        display      : 'none',
                        pointerEvents: 'none',
                        opacity      : '0',
                        transform    : 'translateY(30px)'
                    }
                ) ),

                state( 'visible', style(
                    {
                        display      : 'block',
                        pointerEvents: 'visible',
                        opacity      : '1',
                        transform    : 'translateY(0)'
                    }
                ) ),

                transition( 'visible <=> hidden', [

                    style(
                        {
                            display      : 'block',
                            pointerEvents: 'none'
                        }
                    ),

                    animate( '.25s ease' )
                ] )
            ] )
        ]
    }
)
export class DropdownComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public cdr: ChangeDetectorRef,
        public hostElement: ElementRef,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {
        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }

    @ContentChildren( DropdownChoiceComponent )
    private set choiceComponents( choices: QueryList<DropdownChoiceComponent> ) {

        /* Dispose of possible old subscriptions */
        this.disposeSubscriptions.forEach( subscription => subscription.unsubscribe() );

        /* Wait for every choice to initialise */
        zip( ...choices.map( choice => choice.loadedState ) ).subscribe( () => {

            this.choices = choices;

            this.setValue( this.currentChoice === undefined ? null : this.currentChoice );

            /* Subscribe to each select event of the choices */
            for ( const choiceComponent of choices ) {
                this.disposeSubscriptions.push(
                    choiceComponent.feOnSelect.subscribe( () => {
                        this.setChoiceComponent( choiceComponent );
                    } )
                );
            }
        } );
    }

    @ViewChild( 'placeholderPanel' )
    public placeholderPanelRef!: ElementRef<HTMLElement>;

    @ViewChild( 'options' )
    public optionsRef!: ElementRef<HTMLElement>;

    @Input()
    public feEmptyNotice?: string;

    @Input()
    public feEmptyTemplate?: TemplateRef<any>;

    @Input()
    public feInline?: boolean | '' = undefined;

    @Input()
    public feClearable = true;

    @Input()
    public feTheme!: ComponentTheme<PartialDropdownTheme>;

    @Output()
    public feChange = new EventEmitter();

    @Output()
    public feManualClear = new EventEmitter();

    public activePlaceholderRef?: TemplateRef<any>;
    public defaultPlaceholderRef?: TemplateRef<any>;
    public dropdownVisible          = false;
    public dropdownVisibleWithDelay = false;

    private choices!: QueryList<DropdownChoiceComponent>;
    private currentChoice: string | null | undefined = undefined;

    private disposeSubscriptions: Subscription[] = [];
    private disposeListeners: ( () => void )[]   = [];

    /* Form API */
    private formInputEvent?: ( value: string | null ) => void;
    private formBlurEvent?: () => void;
    private isInitialValueWrite = true;

    /** Will return undefined until initialisation of the component */
    public get value(): string | null | undefined {
        return this.currentChoice;
    }

    @Input()
    public set value( value: string | null | undefined ) {

        if ( !this.choices ) {

            /* Called before init, setValue method will be called after the choices have been initialized */

            this.currentChoice = value;

        } else {
            this.setValue( value === undefined ? null : value );
        }
    }

    private discardNextUp = false;
    private localMouseUp  = false;

    public ngAfterViewInit(): void {

        this.ngZone.runOutsideAngular( () => {

            this.disposeListeners.push(
                this.renderer.listen( this.hostElement.nativeElement, 'pointerdown', () => {
                    this.discardNextUp = true;
                } ),

                this.renderer.listen( this.hostElement.nativeElement, 'pointerup', () => {
                    this.localMouseUp = true;
                } ),

                this.renderer.listen( document.documentElement, 'pointerup', () => {

                    if ( !this.localMouseUp && !this.discardNextUp && this.dropdownVisible ) {
                        this.ngZone.run( () => this.toggleMenu() );
                    }

                    this.discardNextUp = false;
                    this.localMouseUp  = false;
                } )
            );
        } );
    }

    @HostBinding( 'style.zIndex' )
    public get zIndex(): string {
        /* Ensure it is *above* other unexpanded dropdowns while closing but *behind* other dropdowns that are expanded while closing */
        return !this.dropdownVisible && this.dropdownVisibleWithDelay ? '1' : this.dropdownVisibleWithDelay ? '2' : 'auto';
    }

    /* To simplify the attribute usage */
    @HostBinding( 'class.inline' )
    private get isStatic() {

        if ( this.feInline === undefined ) {
            return false;
        }

        if ( typeof this.feInline === 'string' ) {
            return true;
        }

        return this.feInline;
    }

    public ngOnDestroy(): void {
        this.disposeSubscriptions.forEach( subscription => subscription.unsubscribe() );
        this.disposeListeners.forEach( ( listener ) => listener() );
    }

    public toggleMenu(): void {

        this.dropdownVisible = !this.dropdownVisible;

        if ( this.dropdownVisible && document.activeElement && ( document.activeElement as any ).blur ) {
            ( document.activeElement as HTMLInputElement ).blur();
        }

        if ( this.formBlurEvent && !this.dropdownVisible ) {
            this.formBlurEvent();
        }

        this.cdr.detectChanges();
    }

    public manualClear(): void {
        this.feManualClear.next();
        this.clearChoiceComponent();
    }

    private setValue( value: string | null ): void {

        if ( value === null ) {
            this.clearChoiceComponent();
            return;
        }

        for ( const choice of this.choices ) {
            if ( choice.feValue === value ) {
                this.setChoiceComponent( choice );
                return;
            }
        }

        /* No choice with the given value has been found */

        this.isInitialValueWrite = false; /* Turn off to correct the set initial value from the forms-api */
        this.clearChoiceComponent(); /* Fallback to no choice at all */
    }

    private setChoiceComponent( choiceComponent: DropdownChoiceComponent ): void {

        this.currentChoice = choiceComponent.feValue;

        this.feChange.next( choiceComponent.feValue );

        /* Prevents marking the field as dirty, although it was the initial value write event from the forms-api */
        if ( this.isInitialValueWrite ) {
            this.isInitialValueWrite = false;
        } else if ( this.formInputEvent ) {
            this.formInputEvent( choiceComponent.feValue );
        }

        this.activePlaceholderRef = choiceComponent.contentAndPlaceholderRef ?? choiceComponent.placeholderRef;
        this.dropdownVisible      = false;

        this.cdr.detectChanges();
    }

    public clearChoiceComponent(): void {

        this.currentChoice = null;

        this.feChange.next( null );

        /* Prevents marking the field as dirty, although it was the initial value write event from the forms-api */
        if ( this.isInitialValueWrite ) {
            this.isInitialValueWrite = false;
        } else if ( this.formInputEvent ) {
            this.formInputEvent( null );
        }

        this.activePlaceholderRef = undefined;
        this.dropdownVisible      = false;

        this.cdr.detectChanges();
    }

    /* Reactive forms functions */

    public writeValue( input: string | null ): void {

        if ( !this.formInputEvent ) {
            this.isInitialValueWrite = true;
        }

        this.value = input;
        this.feChange.next( input );
    }

    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }

    public captureStartEvent( event: any ) {
        if ( event.toState === 'visible' ) {
            this.dropdownVisibleWithDelay = true;
        }
    }

    public captureDoneEvent( event: any ) {
        if ( event.toState === 'hidden' ) {
            this.dropdownVisibleWithDelay = false;
        }
    }
}
