import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';

@FeComponent( 'button' )
@Component(
    {
        selector   : 'fe-button',
        templateUrl: './button.component.html',
        styleUrls  : [ './button.component.scss' ]
    }
)

export class ButtonComponent {
    
    constructor( public hostElement: ElementRef ) { }
    
    @Input()
    public feTheme!: ComponentTheme<PartialButtonTheme>;
    
    @Input()
    public feType: 'submit' | 'button' = 'button';
    
    @Output()
    public feClick: EventEmitter<any> = new EventEmitter();
}

export const ZButtonTheme = z.object(
    {
        text        : ZHEXColor,
        background  : ZHEXColor,
        borderBottom: ZHEXColor
    }
);

export const ZPartialButtonTheme = ZButtonTheme.partial();

export type ButtonTheme = z.infer<typeof ZButtonTheme>;
export type PartialButtonTheme = z.infer<typeof ZPartialButtonTheme>;