import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialBookTheme } from './book.theme';

@FeComponent( 'book' )
@Component( {
    selector   : 'fe-book',
    templateUrl: './book.component.html',
    styleUrls  : [ './book.component.scss' ]
} )

export class BookComponent {

    constructor( public hostElement: ElementRef<HTMLElement> ) {}

    @Input()
    public feTheme!: ComponentTheme<PartialBookTheme>;

    @Input()
    public feCover!: string;

    @Input()
    public feDirection: 'left-to-right' | 'right-to-left' = 'left-to-right';
}
