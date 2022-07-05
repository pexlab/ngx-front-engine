import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter,
    Input, NgZone,
    OnDestroy,
    OnInit, Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { Subscription } from 'rxjs';
import { z } from 'zod';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeService } from '../../theme/theme.service';
import { FeComponent } from '../../utils/component.utils';
import { PartialButtonTheme } from '../button/button.theme';
import { TableCellDirective } from './table-cell.directive';
import { PartialTableTheme } from './table.theme';
import Fuse from 'fuse.js';
import lodash from 'lodash-es';

@FeComponent( 'table' )
@Component(
    {
        selector       : 'fe-table',
        templateUrl    : './table.component.html',
        styleUrls      : [ './table.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations     : [
            trigger( 'columnWidth', [
                transition( ':enter', [
                    style( { width: '{{ width }}', opacity: '0' } )
                ] ),
                transition( ':leave', [
                    style( { width: '{{ width }}' } )
                ] ),
                transition( '* => *', [
                    style( { whiteSpace: 'nowrap' } ),
                    animate( '.25s ease', style( { width: '{{ width }}' } ) )
                ], { params: { width: '0' } } ),
                state( '*', style( { width: '{{ width }}' } ), { params: { width: '0' } } )
            ] )
        ]
    }
)
export class TableComponent implements OnInit, OnDestroy {

    constructor(
        public hostElement: ElementRef<HTMLElement>,
        public cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private theme: ThemeService
    ) { }

    @Input()
    public feTheme!: ComponentTheme<PartialTableTheme>;

    @Input()
    public feColumns!: TableColumn[];

    @Input()
    public set feData( value: { [ key: string ]: any }[] | Promise<{ [ key: string ]: any }[]> | undefined ) {

        if ( value === undefined ) {
            this.resolvedUnaffectedData   = undefined;
            this.resolvedSearchResultData = undefined;
            this.fuse                     = undefined;
            this.cdr.detectChanges();
            return;
        }

        if ( value instanceof Promise ) {

            this.resolvedUnaffectedData   = undefined;
            this.resolvedSearchResultData = undefined;
            this.fuse                     = undefined;

            this.cdr.detectChanges();
            this.scrollIntoView();

            value.then( data => {

                this.resolvedUnaffectedData = data.map( ( item, index ) => {
                    return {
                        ...item,
                        feIndex           : index,
                        feItemIndex       : index + 1,
                        feInitialIndex    : index,
                        feInitialItemIndex: index + 1
                    };
                } );

                this.fuse = new Fuse( this.resolvedUnaffectedData, this.fuseOptions );

                this.cdr.detectChanges();
                this.scrollIntoView();
            } );

        } else {

            this.resolvedUnaffectedData = value.map( ( item, index ) => {
                return {
                    ...item,
                    feIndex           : index,
                    feItemIndex       : index + 1,
                    feInitialIndex    : index,
                    feInitialItemIndex: index + 1
                };
            } );

            this.fuse = new Fuse( this.resolvedUnaffectedData, this.fuseOptions );

            this.cdr.detectChanges();
            this.scrollIntoView();
        }
    };

    @Input()
    public feActions: TableAction[] = [];

    @Input()
    public feReorderable = false;

    @Output()
    public feOnReorder: EventEmitter<{ [ key: string ]: any }[]> = new EventEmitter();

    @Input()
    public feAutoFocus?: HTMLElement;

    // TODO: add functionally
    @Input()
    public feSelectable = false;

    @Input()
    public set feSearchTerm( term: string | null | undefined ) {

        if ( term === undefined || term === null || term.length === 0 ) {
            this.resolvedSearchResultData = undefined;
            this.cdr.detectChanges();
            return;
        }

        switch ( this.feSearchMode ) {

            case 'fuzzy': {

                if ( this.fuse !== undefined ) {

                    const result = this.fuse.search( term );

                    this.resolvedSearchResultData = result.filter( ( record ) => {
                        return record.score !== undefined && record.score <= 0.6;
                    } ).map( ( record, index ) => {
                        return {
                            ...record.item,
                            feIndex    : index,
                            feItemIndex: index + 1
                        };
                    } );

                } else {
                    this.resolvedSearchResultData = undefined;
                }

                break;
            }

            case 'accurate': {

                if ( this.resolvedUnaffectedData === undefined || !term ) {
                    this.resolvedSearchResultData = undefined;
                    break;
                }

                const matches = this.resolvedUnaffectedData.filter( ( record ) => {

                    const find = ( obj: Record<string, any> ) => {

                        for ( const key of Object.keys( obj ) ) {

                            if ( typeof obj[ key ] === 'string' || typeof obj[ key ] === 'number' ) {

                                if ( String( obj[ key ] ).toLowerCase().search( new RegExp( term.toLowerCase(), 'g' ) ) !== -1 ) {
                                    return true;
                                }

                            } else if ( typeof obj[ key ] === 'object' ) {

                                if ( find( obj[ key ] ) ) {
                                    return true;
                                }

                            } else if ( lodash.isArray( obj[ key ] ) ) {

                                if ( obj[ key ].some( find ) ) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    };

                    return find( record );

                } ).map( ( record, index ) => {
                    return {
                        ...record,
                        feIndex    : index,
                        feItemIndex: index + 1
                    };
                } );

                this.resolvedSearchResultData = matches;

                break;
            }
        }

        this.cdr.detectChanges();
    }

    @Input()
    public feSearchMode: 'accurate' | 'fuzzy' = 'accurate';

    @ViewChild( 'scroll', { read: ElementRef } )
    public scrollRef!: ElementRef<HTMLElement>;

    @ViewChildren( 'column' )
    public set setColumnElements( value: QueryList<ElementRef<HTMLElement>> ) {
        this.columnElements = value;
        this.calculateGreatestColumnWidth();
    }

    @ViewChildren( 'cell' )
    private set setCellElements( value: QueryList<TableCellDirective> ) {
        this.cellElements = value;
        this.calculateGreatestColumnWidth();
    }

    public getPath = lodash.get;

    public fuse?: Fuse<any>;

    public get fuseOptions() {

        if ( this.feColumns === undefined ) {
            return {};
        }

        return {
            keys           : this.feColumns.map( ( column ) => {
                return column.linkedProperty;
            } ).filter( key => key !== 'feIndex' && key !== 'feItemIndex' && key !== 'feInitialIndex' && key !== 'feInitialItemIndex' ),
            shouldSort     : true,
            isCaseSensitive: false,
            includeScore   : true,
            ignoreLocation : true
        } as Fuse.IFuseOptions<any>;
    }

    private listeners: Function[]         = [];
    private subscriptions: Subscription[] = [];

    private columnElements?: QueryList<ElementRef<HTMLElement>>;
    private cellElements?: QueryList<TableCellDirective>;

    public get buttonTheme(): ComponentTheme<PartialButtonTheme> {
        return {
            palette: {
                text      : this.feTheme?.palette.button?.text ?? this.theme.component.table.button.text,
                background: this.feTheme?.palette.button?.background ?? this.theme.component.table.button.background,
                circle    : {
                    tooltipText: this.feTheme?.palette.button?.tooltip ?? this.theme.component.table.button.tooltip
                }
            }
        };
    }

    /* After resolving a potential promise from the feData directive, the data is resolved to this property */
    public resolvedUnaffectedData: { [ key: string ]: any }[] | undefined;

    /* After applying the search function, the filtered data is resolved to this property */
    public resolvedSearchResultData: { [ key: string ]: any }[] | undefined;

    /* If a search is active, this property is the filtered result otherwise it is just the resolved unaffected data */
    public get resolvedRelevantData(): { [ key: string ]: any }[] | undefined {
        return this.resolvedSearchResultData ?? this.resolvedUnaffectedData;
    }

    public greatestColumnWidth: number[]  = [];
    public highlightedColumnIndex: number = NaN;

    public dragCurrentIndex             = NaN;
    public dragTargetIndex              = NaN;
    public dragDirection: 'up' | 'down' = 'down';
    public lastDraggedItemIndex         = NaN;
    public dragDummyEl?: HTMLElement;
    public dragTargetEl?: HTMLElement;
    private dragOffsetY: number         = 0;

    /* Helper functions for template */
    public isNaN = isNaN;
    public NaN   = () => NaN;

    public get isScrollable() {

        const scrollableContent = this.scrollRef?.nativeElement.children.item( 1 );

        if ( !scrollableContent ) {
            return false;
        }

        return scrollableContent.scrollHeight > scrollableContent.clientHeight;
    }

    public ngOnInit(): void {

        /* Listen to events without triggering change detection */
        this.ngZone.runOutsideAngular( () => {
            this.listeners.push(
                this.renderer.listen( window, 'pointermove', ( event ) => this.pointerMove( event ) ),
                this.renderer.listen( window, 'pointerup', () => this.pointerUp() )
            );
        } );

        this.subscriptions.push(
            this.theme.onThemeChange.subscribe( () => {
                this.cdr.detectChanges();
            } )
        );
    }

    public ngOnDestroy(): void {

        /* Unsubscribe all event listeners outside the ngZone */
        this.listeners.forEach( ( listener ) => listener() );

        this.subscriptions.forEach( ( subscription ) => subscription.unsubscribe() );
    }

    public scrollIntoView() {
        if ( this.feAutoFocus !== undefined ) {
            this.feAutoFocus.scrollTo(
                {
                    top     : this.hostElement.nativeElement.offsetTop - ( this.hostElement.nativeElement.parentElement?.offsetTop ?? 0 ) - 1,
                    behavior: 'smooth'
                }
            );
        }
    }

    public calculateGreatestColumnWidth(): void {

        this.greatestColumnWidth = [];

        if ( this.cellElements === undefined ) {
            return;
        }

        if ( this.columnElements === undefined ) {
            return;
        }

        this.cellElements.forEach( ( cell ) => {

            const index     = cell.info.index;
            const cellWidth = Math.ceil( cell.width );

            if ( this.greatestColumnWidth[ index ] === undefined || this.greatestColumnWidth[ index ] < cellWidth ) {
                this.greatestColumnWidth[ index ] = cellWidth;
            }

            this.feColumns.forEach( ( column, index ) => {

                const columnEl = this.columnElements?.get( index )?.nativeElement;

                if ( columnEl === undefined ) {
                    return;
                }

                const columnWidth = Math.ceil( columnEl.getBoundingClientRect().width );

                if ( columnWidth > this.greatestColumnWidth[ index ] ) {
                    this.greatestColumnWidth[ index ] = columnWidth;
                }
            } );
        } );
    }

    public pointerDown( event: PointerEvent, rowElRef: HTMLDivElement, index: number ): void {

        /* User clicked on checkbox */
        if ( event.composedPath().find( ( el ) => el instanceof HTMLElement && el.tagName.toLowerCase() === 'fe-checkbox' ) ) {
            return;
        }

        const scrollableContent = this.scrollRef.nativeElement.children.item( 1 );

        const dragDummy = rowElRef.cloneNode( true ) as HTMLElement;

        this.dragDummyEl  = dragDummy;
        this.dragTargetEl = rowElRef;

        this.dragOffsetY = event.clientY - this.dragTargetEl.getBoundingClientRect().top;

        this.renderer.appendChild( scrollableContent, dragDummy );
        this.dragDummyEl.classList.add( 'dragDummy' );
        this.dragDummyEl.classList.add( 'animateIn' );

        this.dragCurrentIndex = index;

        if ( !scrollableContent ) {
            return;
        }

        this.dragDummyEl.style.top = ( event.clientY - scrollableContent.getBoundingClientRect().top - this.dragOffsetY ) + 'px';
    }

    public pointerMove( event: PointerEvent ) {

        if ( this.dragDummyEl === undefined ) {
            return;
        }

        event.preventDefault();

        const scrollableContent = this.scrollRef.nativeElement.children.item( 1 );

        if ( !scrollableContent ) {
            return;
        }

        this.dragDummyEl.style.top = ( event.clientY - scrollableContent.getBoundingClientRect().top - this.dragOffsetY ) + 'px';
    }

    public get dragTargetToIndex(): number {

        let toIndex = this.dragTargetIndex + ( this.dragTargetIndex >= this.dragCurrentIndex ? 0 : this.dragDirection === 'down' ? 1 : 0 );

        if ( toIndex > this.dragCurrentIndex && this.dragDirection === 'down' ) {
            toIndex += 1;
        }

        return toIndex;
    }

    public pointerUp() {

        if ( this.dragDummyEl === undefined || this.dragTargetEl === undefined ) {
            return;
        }

        const fromIndex = this.dragCurrentIndex;
        let toIndex     = this.dragTargetIndex + ( this.dragTargetIndex >= this.dragCurrentIndex ? 0 : this.dragDirection === 'down' ? 1 : 0 );

        if ( this.dragCurrentIndex + 1 === this.dragTargetIndex && this.dragDirection === 'up' ) {
            toIndex = this.dragTargetIndex - 1;
        }

        if ( fromIndex !== toIndex ) {

            const arrayCopy = this.resolvedUnaffectedData ? [ ...this.resolvedUnaffectedData ] : [];

            const element = arrayCopy[ fromIndex ];
            arrayCopy.splice( fromIndex, 1 );
            arrayCopy.splice( toIndex, 0, element );

            arrayCopy.forEach( ( item, index ) => {
                arrayCopy[ index ][ 'feIndex' ]     = index;
                arrayCopy[ index ][ 'feItemIndex' ] = index + 1;
            } );

            this.resolvedUnaffectedData = arrayCopy;
        }

        this.lastDraggedItemIndex = toIndex;
        this.dragOffsetY          = 0;
        this.dragCurrentIndex     = NaN;
        this.dragTargetIndex      = NaN;

        this.dragDummyEl.remove();

        this.dragDummyEl  = undefined;
        this.dragTargetEl = undefined;

        this.cdr.detectChanges();

        if ( this.resolvedUnaffectedData !== undefined ) {
            this.feOnReorder.emit( this.resolvedUnaffectedData );
        }
    }

    public animateRowIn( row: number ) {

        setTimeout( () => {
            if ( this.lastDraggedItemIndex === row ) {
                this.lastDraggedItemIndex = NaN;
            }
        }, 1050 );

        return true;
    }

    public pointerOver( element: HTMLElement, index: number ) {

        if ( this.dragDummyEl === undefined ) {
            return;
        }

        if ( this.dragDummyEl === element ) {
            return;
        }

        /* Find in which direction the user is currently dragging */
        if ( this.dragTargetIndex < index ) {
            this.dragDirection = 'down';
        } else if ( this.dragTargetIndex > index ) {
            this.dragDirection = 'up';
        } else {
            /* Element moved away but the user still ended up on the same item, this tells us that the user changed direction to the opposite */
            this.dragDirection = this.dragDirection === 'down' ? 'up' : 'down';
        }

        this.dragTargetIndex = index;
    }
}

export const TableDemoActions = [
    {
        label  : 'Table Presets',
        icon   : 'fe-bookmarks',
        onClick: () => {}
    },
    {
        label  : 'Show in a Grid',
        icon   : 'fe-grid',
        onClick: function() {
            if ( this.label === 'Show in a Grid' ) {
                this.label = 'Show as a List';
                this.icon  = 'fe-list';
            } else {
                this.label = 'Show in a Grid';
                this.icon  = 'fe-grid';
            }
        }
    },
    {
        label  : 'Fullscreen',
        icon   : 'fe-maximize',
        onClick: function() {
            if ( this.label === 'Fullscreen' ) {
                this.label = 'Exit Fullscreen';
                this.icon  = 'fe-minimize';
            } else {
                this.label = 'Fullscreen';
                this.icon  = 'fe-maximize';
            }
        }
    },
    {
        label  : 'Export as File',
        icon   : 'fe-table-export',
        onClick: () => {}
    },
    {
        label  : 'Filter Records',
        icon   : 'fe-filter',
        onClick: () => {}
    },
    {
        label  : 'Add new Record',
        icon   : 'fe-add',
        onClick: () => {}
    }
];

const ZTableColumnLabel = z.union(
    [
        z.object(
            {
                icon       : z.string(),
                text       : z.string(),
                collapsible: z.boolean().default( false ).optional()
            }
        ),
        z.object(
            {
                icon       : z.undefined(),
                text       : z.string(),
                collapsible: z.undefined()
            }
        )
    ]
);

const ZTableColumnSort = z.object(
    {
        canBeOverwritten: z.boolean().default( true ),
        initial         : z.object(
            {
                direction       : z.enum( [ 'asc', 'desc', 'none' ] ).default( 'none' ),
                overwritesMemory: z.boolean().default( false ),
                overwritesOrder : z.boolean().default( false )
            }
        )
    }
).default(
    {
        canBeOverwritten: true,
        initial         : {
            direction       : 'none',
            overwritesMemory: false,
            overwritesOrder : false
        }
    }
).optional();

export const ZTableColumn = z.object(
    {
        linkedProperty  : z.string(),
        renderer        : z.undefined(),
        label           : ZTableColumnLabel,
        sort            : ZTableColumnSort,
        align           : z.enum( [ 'left', 'center', 'right' ] ).optional(),
        passThroughClick: z.boolean().optional(),
        onClick         : z.function().args( z.record( z.any() ) ).returns( z.void() ).optional()
    }
).or(
    z.object(
        {
            linkedProperty  : z.any(),
            renderer        : z.any(),
            label           : ZTableColumnLabel,
            sort            : ZTableColumnSort,
            align           : z.enum( [ 'left', 'center', 'right' ] ).optional(),
            passThroughClick: z.boolean().optional(),
            onClick         : z.function().args( z.record( z.any() ) ).returns( z.void() ).optional()
        }
    )
);

export const ZTableAction = z.object(
    {
        label  : z.string(),
        icon   : z.string(),
        onClick: z.function().returns( z.void() )
    }
);

export type TableColumn = z.infer<typeof ZTableColumn>;
export type TableAction = z.infer<typeof ZTableAction>;
