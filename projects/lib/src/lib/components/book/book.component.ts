import { Component, ElementRef, Input } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { PartialBookTheme } from './book.theme';

@Component( {
    selector   : 'fe-book',
    templateUrl: './book.component.html',
    styleUrls  : [ './book.component.scss' ]
} )

export class BookComponent extends ThemeableFeComponent {

    constructor( public hostElement: ElementRef<HTMLElement> ) {
        super();
        this.initializeFeComponent( 'book', this );
    }

    @Input()
    public feTheme: ComponentTheme<PartialBookTheme> | undefined;

    @Input()
    public feCover!: string;

    @Input()
    public feDirection: 'left-to-right' | 'right-to-left' = 'left-to-right';
}
