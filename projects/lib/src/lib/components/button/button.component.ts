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
    public feAppearance: 'simple' | 'raised-simple' | 'pill' | 'raised-pill' | 'hinge' | 'artistic-curves' | 'see-through-light' | 'see-through-dark' | 'handwritten' = 'pill';

    @Input()
    public feType: 'submit' | 'button' = 'button';

    @Output()
    public feClick: EventEmitter<any> = new EventEmitter();
}

export const ZButtonTheme = z.object(
    {
        text        : ZHEXColor,
        background  : ZHEXColor,
        borderBottom: ZHEXColor,
        hinge       : z.object(
            {
                hoverText      : ZHEXColor,
                hoverBackground: ZHEXColor
            }
        )
    }
);

export const ZPartialButtonTheme = ZButtonTheme.deepPartial();

export type ButtonTheme = z.infer<typeof ZButtonTheme>;
export type PartialButtonTheme = z.infer<typeof ZPartialButtonTheme>;
