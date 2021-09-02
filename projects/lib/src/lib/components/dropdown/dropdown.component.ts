import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    QueryList,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { DropdownChoiceComponent } from './choice/dropdown-choice.component';
import { DropdownDefaultInputDirective } from './dropdown-default.directive';

@FeComponent( 'dropdown' )
@Component(
    {
        selector       : 'fe-dropdown',
        templateUrl    : './dropdown.component.html',
        styleUrls      : [ './dropdown.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class DropdownComponent implements AfterViewInit, OnDestroy {
    
    constructor(
        private cdr: ChangeDetectorRef,
        public hostElement: ElementRef
    ) { }
    
    @ContentChildren( DropdownChoiceComponent )
    private set choiceComponents( value: QueryList<DropdownChoiceComponent> ) {
        
        this.choices = value;
        
        /* Dispose of possible old subscriptions */
        this.disposeSubscriptions.forEach( subscription => subscription.unsubscribe() );
        
        /* Subscribe to each select event of the choices */
        for ( const choiceComponent of this.choices ) {
            this.disposeSubscriptions.push(
                choiceComponent.feOnSelect.subscribe( () => {
                    this.setChoice( choiceComponent );
                } )
            );
        }
        
        /* If no other choice have been made until now, set the default choice if available */
        if ( this.defaultChoice && this.currentChoice === undefined ) {
            
            this.currentChoice         = this.defaultChoice.host.feValue;
            this.defaultPlaceholderRef = this.defaultChoice.host.placeholderRef;
            
            this.feOnSelect.emit( this.defaultChoice.host.feValue );
            
        } else {
            this.setValue( this.currentChoice || null );
        }
    }
    
    @ContentChild( DropdownDefaultInputDirective )
    public defaultChoice?: DropdownDefaultInputDirective;
    
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
    public feOnSelect = new EventEmitter<string | null>();
    
    public activePlaceholderRef?: TemplateRef<any>;
    public defaultPlaceholderRef?: TemplateRef<any>;
    public dropdownVisible = false;
    
    private choices!: QueryList<DropdownChoiceComponent>;
    private currentChoice: string | null | undefined = undefined;
    private disposeSubscriptions: Subscription[]     = [];
    
    /** Will return undefined until initialisation of the component */
    public get value(): string | null | undefined {
        return this.currentChoice;
    }
    
    @Input()
    public set value( value: string | null | undefined ) {
        
        if ( value === undefined ) {
            this.setValue( null );
            return;
        }
        
        /* Called before init, setValue method will be called after the choices have been initialized */
        if ( !this.choices ) {
            this.currentChoice = value;
            return;
        }
        
        this.setValue( value );
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
    
    public ngAfterViewInit(): void {
        /* Enable manual change detection to increase performance */
        this.cdr.detach();
    }
    
    public ngOnDestroy(): void {
        this.disposeSubscriptions.forEach( subscription => subscription.unsubscribe() );
    }
    
    public toggleMenu(): void {
        this.dropdownVisible = !this.dropdownVisible;
        this.cdr.detectChanges();
    }
    
    private setValue( value: string | null ): void {
        
        if ( value === null ) {
            this.clearValue();
            return;
        }
        
        for ( const choice of this.choices ) {
            if ( choice.feValue === value ) {
                this.setChoice( choice );
                return;
            }
        }
        
        /* No choice with the given name have been found, clear the dropdown */
        this.clearValue();
    }
    
    private setChoice( choiceComponent: DropdownChoiceComponent ): void {
        
        this.currentChoice = choiceComponent.feValue;
        this.feOnSelect.emit( choiceComponent.feValue );
        
        this.activePlaceholderRef = choiceComponent.placeholderRef;
        this.dropdownVisible      = false;
        
        this.cdr.detectChanges();
    }
    
    public clearValue(): void {
        
        if ( this.defaultChoice ) {
            this.setChoice( this.defaultChoice.host );
            return;
        }
        
        this.feOnSelect.emit( null );
        
        this.currentChoice = null;
        
        this.activePlaceholderRef = undefined;
        this.dropdownVisible      = false;
        
        this.cdr.detectChanges();
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