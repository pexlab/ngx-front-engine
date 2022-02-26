import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    Self
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';

@FeComponent( 'switch' )
@Component(
    {
        selector       : 'fe-switch',
        templateUrl    : './switch.component.html',
        styleUrls      : [ './switch.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class SwitchComponent implements OnInit, ControlValueAccessor {
    
    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl,
        public hostElement: ElementRef,
        private cdr: ChangeDetectorRef
    ) {
        if ( this.ngControl ) {
            this.ngControl.valueAccessor = this;
        }
    }
    
    @Input()
    public feTheme!: ComponentTheme<PartialSwitchTheme>;
    
    @Input()
    public feAppearance: 'minimal' | 'traditional' = 'minimal';
    
    @Input()
    public feValues: [ string, string ] | [ boolean, boolean ] = [ false, true ];
    
    @Input()
    public feLabelLeft?: string;
    
    @Input()
    public feLabelRight?: string;
    
    @Input()
    public feIconLeft?: string;
    
    @Input()
    public feIconRight?: string;
    
    @Output()
    public feChange = new EventEmitter();
    
    /* Form API */
    private formInputEvent?: ( value: string | boolean ) => void;
    private formBlurEvent?: () => void;
    
    public positionIndex: 0 | 1 = 0;
    
    public ngOnInit(): void {
        
        if ( ( this.feIconLeft || this.feIconRight ) && this.feAppearance !== 'traditional' ) {
            throw new Error( 'Icons are only available on the traditional appearance' );
        }
    }
    
    public toggle( position?: 0 | 1 ): void {
        
        if ( position !== undefined ) {
            
            this.positionIndex = position;
            
        } else {
            
            if ( this.positionIndex === 0 ) {
                this.positionIndex = 1;
            } else {
                this.positionIndex = 0;
            }
        }
        
        this.feChange.next( this.feValues[ this.positionIndex ] );
        
        if ( this.formInputEvent ) {
            this.formInputEvent( this.feValues[ this.positionIndex ] );
        }
    }
    
    public get position(): 'left' | 'right' {
        return this.positionIndex === 0 ? 'left' : 'right';
    }
    
    /* Reactive forms functions */
    
    public writeValue( input: any ): void {
        
        if ( typeof input === 'boolean' || typeof input === 'string' ) {
            
            const index = this.feValues.findIndex( ( comparison ) => comparison === input );
            
            if ( isNaN( index ) || !( index === 0 || index === 1 ) ) {
                throw new Error(
                    'Invalid value "' + input + '" to write on switch component.' +
                    'Valid values are: ' + this.feValues.toString()
                );
            } else {
                this.positionIndex = index;
            }
            
        } else if ( typeof input === 'number' && ( input === 0 || input === 1 ) ) {
            
            this.positionIndex = input;
            
        } else {
            throw new Error( 'Invalid value "' + input + '" to write on switch component.' );
        }
        
        this.feChange.next( this.feValues[ this.positionIndex ] );
        
        this.cdr.markForCheck();
    }
    
    public registerOnChange( fn: any ): void {
        this.formInputEvent = fn;
    }
    
    public registerOnTouched( fn: any ): void {
        this.formBlurEvent = fn;
    }
}

export type SwitchInputValue = 'left' | 'right';

export const ZSwitchTheme = z.object(
    {
        
        /* Shared */
        
        activeLabel  : ZHEXColor,
        inactiveLabel: ZHEXColor,
        
        /* Minimal */
        
        minimalOuterBallLeft : ZHEXColor,
        minimalOuterBallRight: ZHEXColor,
        
        minimalInnerBallLeft : ZHEXColor,
        minimalInnerBallRight: ZHEXColor,
        
        minimalLineLeft : ZHEXColor,
        minimalLineRight: ZHEXColor,
        
        /* Traditional */
        
        traditionalBackgroundLeft : ZHEXColor,
        traditionalBackgroundRight: ZHEXColor,
        
        traditionalBorderLeft : ZHEXColor,
        traditionalBorderRight: ZHEXColor,
        
        traditionalBallLeft : ZHEXColor,
        traditionalBallRight: ZHEXColor,
        
        traditionalIconLeft : ZHEXColor,
        traditionalIconRight: ZHEXColor
    }
);

export const ZPartialSwitchTheme = ZSwitchTheme.partial();

export type SwitchTheme = z.infer<typeof ZSwitchTheme>;
export type PartialSwitchTheme = z.infer<typeof ZPartialSwitchTheme>;