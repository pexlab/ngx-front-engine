import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef, EventEmitter,
    HostBinding,
    Input,
    OnDestroy, Optional, Output,
    QueryList, Self,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { DropdownChoiceComponent } from './choice/dropdown-choice.component';

@FeComponent( 'dropdown' )
@Component(
    {
        selector       : 'fe-dropdown',
        templateUrl    : './dropdown.component.html',
        styleUrls      : [ './dropdown.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class DropdownComponent implements OnDestroy, ControlValueAccessor {
    
    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        private cdr: ChangeDetectorRef,
        public hostElement: ElementRef
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
    public feEmptyNotice = 'Choose';
    
    @Input()
    public feInline?: boolean | '' = undefined;
    
    @Input()
    public feClearable = true;
    
    @Input()
    public feTheme!: ComponentTheme<PartialDropdownTheme>;
    
    @Output()
    public feChange = new EventEmitter();
    
    public activePlaceholderRef?: TemplateRef<any>;
    public defaultPlaceholderRef?: TemplateRef<any>;
    public dropdownVisible = false;
    
    private choices!: QueryList<DropdownChoiceComponent>;
    private currentChoice: string | null | undefined = undefined;
    private disposeSubscriptions: Subscription[]     = [];
    
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
    
    @HostBinding( 'style.zIndex' )
    public get zIndex(): string {
        return this.dropdownVisible ? '2' : '0';
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
    }
    
    public toggleMenu(): void {
        
        this.dropdownVisible = !this.dropdownVisible;
        
        if ( this.formBlurEvent && !this.dropdownVisible ) {
            this.formBlurEvent();
        }
        
        this.cdr.detectChanges();
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
        
        /* Prevents marking the field as dirty although it was the initial value write event from the forms-api */
        if ( this.isInitialValueWrite ) {
            this.isInitialValueWrite = false;
        } else if ( this.formInputEvent ) {
            this.formInputEvent( choiceComponent.feValue );
        }
        
        this.activePlaceholderRef = choiceComponent.placeholderRef;
        this.dropdownVisible      = false;
        
        this.cdr.detectChanges();
    }
    
    public clearChoiceComponent(): void {
        
        this.currentChoice = null;
        
        this.feChange.next( null );
        
        /* Prevents marking the field as dirty although it was the initial value write event from the forms-api */
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
}

export const ZDropdownTheme = z.object(
    {
        placeholderPanelText      : ZHEXColor,
        placeholderPanelBackground: ZHEXColor,
        
        optionsStripe         : ZHEXColor,
        optionsIdleText       : ZHEXColor,
        optionsIdleBackground : ZHEXColor,
        optionsHoverText      : ZHEXColor,
        optionsHoverBackground: ZHEXColor,
        
        clearButtonIdle           : ZHEXColor,
        clearButtonIdleBackground : ZHEXColor,
        clearButtonHover          : ZHEXColor,
        clearButtonHoverBackground: ZHEXColor
    }
);

export const ZPartialDropdownTheme = ZDropdownTheme.partial();

export type DropdownTheme = z.infer<typeof ZDropdownTheme>;
export type PartialDropdownTheme = z.infer<typeof ZPartialDropdownTheme>;