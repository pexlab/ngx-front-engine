import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialButtonTheme } from './button.theme';

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
    public feAppearance: 'simple'
                         | 'raised-simple'
                         | 'pill'
                         | 'raised-pill'
                         | 'circle'
                         | 'circle-hover'
                         | 'circle-hover-with-fallback'
                         | 'hinge'
                         | 'artistic-curves'
                         | 'see-through-light'
                         | 'see-through-dark'
                         | 'handwritten' = 'pill';

    @Input()
    public feType: 'submit' | 'button' = 'button';

    @Input()
    public feLink?: string;

    @Input()
    public feLinkTarget: 'auto' | 'same_tab' | 'new_tab' = 'auto';

    @Output()
    public feClick: EventEmitter<any> = new EventEmitter();
}
