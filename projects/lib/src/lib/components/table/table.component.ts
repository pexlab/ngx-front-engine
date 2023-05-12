import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import Fuse from 'fuse.js';
import lodash from 'lodash-es';
import { nanoid } from 'nanoid';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeService } from '../../theme/theme.service';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { isElementVisibleInScrollableContainer } from '../../utils/element.utils';
import { escapeRegExp } from '../../utils/string.utils';
import { PartialButtonTheme } from '../button/button.theme';
import { feTrackRow, VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { PartialInlineTableTheme } from './inline/inline-table.theme';
import { TableRowComponent } from './row/table-row.component';
import { PartialTableTheme } from './table.theme';
import { computeColumnWidths, ComputedTableRow, TableAction, TableColumn, TableLike } from './table.utils';

@Component(
    {
        selector       : 'fe-table',
        templateUrl    : './table.component.html',
        styleUrls      : [ './table.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class TableComponent extends ThemeableFeComponent implements OnInit, OnDestroy, AfterViewInit, TableLike {

    constructor(
        public hostElement: ElementRef<HTMLElement>,
        public change: ChangeDetectorRef,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private theme: ThemeService
    ) {
        super();
        this.initializeFeComponent( 'table', this );
    }

    /* Outputs */

    @Output()
    public feOnReorder: EventEmitter<{ [ key: string ]: any }[]> = new EventEmitter();

    /* Inputs */

    @Input()
    public feTheme: ComponentTheme<PartialTableTheme> | undefined;

    @Input()
    public feColumns!: TableColumn[] | undefined;

    @Input()
    public feActions: TableAction[] = [];

    @Input()
    public feReorderable = false;

    @Input()
    public feAutoFocus?: HTMLElement;

    // TODO: add functionally
    @Input()
    public feSelectable = false;

    @Input()
    public feSearchMode: 'accurate' | 'fuzzy' = 'accurate';

    @Input()
    public set feData( value: { [ key: string ]: any }[] | Promise<{ [ key: string ]: any }[]> | undefined ) {

        if ( value === undefined ) {
            this.resolvedUnaffectedData   = undefined;
            this.resolvedSearchResultData = undefined;
            this.fuse                     = undefined;
            this.inlineTables.clear();
            this.change.detectChanges();
            return;
        }

        const setData = ( data: { [ key: string ]: any }[] ) => {

            this.resolvedUnaffectedData = data.map( ( item, index ) => {

                if ( item.feInlineTable !== undefined ) {
                    this.inlineTables.set( index, item.feInlineTable );
                }

                return {
                    ...item,
                    feIndex           : index,
                    feItemIndex       : index + 1,
                    feInitialIndex    : index,
                    feInitialItemIndex: index + 1,
                    feRowId           : String( index )
                };
            } );

            this.fuse = new Fuse( this.resolvedUnaffectedData, this.fuseOptions );

            this.change.detectChanges();
            this.scrollIntoView();
        };

        if ( value instanceof Promise ) {

            this.resolvedUnaffectedData   = undefined;
            this.resolvedSearchResultData = undefined;
            this.fuse                     = undefined;
            this.inlineTables.clear();

            this.change.detectChanges();
            this.scrollIntoView();

            value.then( data => setData( data ) );

        } else {
            setData( value );
        }
    };

    @Input()
    public set feSearchTerm( term: string | null | undefined ) {

        if ( term === undefined || term === null || term.length === 0 ) {
            this.resolvedSearchResultData                      = undefined;
            this.virtualScrollElement.nativeElement.scrollTop  = 0;
            this.virtualScrollElement.nativeElement.scrollLeft = 0;
            this.change.detectChanges();
            return;
        }

        this.onSearchTermChange$.next( term );
    }

    /* View and Content Children */

    @ViewChildren( 'feRow' )
    private activeRows!: QueryList<TableRowComponent>;

    @ViewChild( 'heading' )
    public headingRef!: ElementRef<HTMLElement>;

    @ViewChild( 'feScroll', { read: ElementRef } )
    public virtualScrollElement!: ElementRef<HTMLElement>;

    @ViewChild( 'feScroll' )
    public virtualScrollComponent!: VirtualScrollComponent;

    @ViewChildren( 'columnHeading' )
    public columnHeadingRef!: QueryList<ElementRef<HTMLElement>>;

    /* Listeners */

    @HostListener( 'window:resize' )
    public onResize() {
        this.computeColumnWidth();
    }

    /* Variables */

    public id = nanoid();

    /* After resolving a potential promise from the feData directive, the data is resolved to this property */
    public resolvedUnaffectedData: ComputedTableRow[] | undefined;

    /* After applying the search function, the filtered data is resolved to this property */
    public resolvedSearchResultData: ComputedTableRow[] | undefined;

    public highlightedColumnIndex: number = NaN;

    public fuse?: Fuse<any>;

    public measureRows = new EventEmitter<void | HTMLElement[]>();

    private lastClientY = 0;

    private lastPageX = 0;

    private lastPageY = 0;

    private stillOnRow = false;

    private lastHoveredRow = NaN;

    private onDestroy$ = new Subject<void>();

    private onSearchTermChange$ = new Subject<string>();

    public inlineTables: Map<number, {
        feTheme?: ComponentTheme<PartialInlineTableTheme>,
        feColumns: TableColumn[],
        feData: { [ key: string ]: any }[],
        feReorderable?: boolean,
        feOnReorder?: EventEmitter<{ [ key: string ]: any }[]>,
        feSelectable?: boolean,
    }> = new Map();

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

    public drag = {
        current  : {
            index: NaN as number
        },
        target   : {
            index  : NaN as number,
            element: undefined as HTMLElement | undefined
        },
        last     : {
            index: NaN as number
        },
        dummy    : {
            element: undefined as HTMLElement | undefined
        },
        direction: 'down' as 'up' | 'down',
        offset   : {
            y: 0 as number
        }
    };

    /* Life-cycle methods */

    public ngOnInit(): void {

        this.ngZone.runOutsideAngular( () => {

            /* Listen to events without automatically triggering change detection */

            fromEvent<PointerEvent>( window, 'pointermove' ).pipe(
                takeUntil( this.onDestroy$ )
            ).subscribe( {
                next: ( event ) => {
                    this.pointerMove( event, true );
                }
            } );

            fromEvent<PointerEvent>( window, 'pointerup' ).pipe(
                takeUntil( this.onDestroy$ )
            ).subscribe( {
                next: ( event ) => {
                    this.pointerUp( event );
                }
            } );

            this.theme.onThemeChange.pipe(
                takeUntil( this.onDestroy$ )
            ).subscribe( () => {
                this.change.detectChanges();
            } );

            this.onSearchTermChange$.pipe(
                debounceTime( 500 ),
                takeUntil( this.onDestroy$ )
            ).subscribe( {
                next: ( term ) => {
                    this.conductSearch( term );
                }
            } );
        } );
    }

    public ngAfterViewInit(): void {

        this.ngZone.runOutsideAngular( () => {

            if ( this.virtualScrollElement === undefined || this.virtualScrollComponent === undefined ) {
                throw new Error( 'Virtual scroll not initialized' );
            }

            /* Link the scroll postion of the body to the scroll position of the heading */
            fromEvent( this.virtualScrollElement.nativeElement, 'scroll' ).pipe(
                takeUntil( this.onDestroy$ )
            ).subscribe( {
                next: () => {

                    this.pointerMove( event as any, false );

                    if ( this.headingRef === undefined ) {
                        return;
                    }

                    this.headingRef.nativeElement.scrollLeft = this.virtualScrollElement.nativeElement.scrollLeft;
                }
            } );
        } );
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public onRender( range: [ number, number ] ) {

        this.virtualScrollComponent.updatable = false;

        this.change.detectChanges();

        requestAnimationFrame( () => {
            this.computeColumnWidth();
        } );
    }

    /* Logic */

    public computeColumnWidth(): void {

        /* Abort conditions */

        if ( this.feColumns === undefined ) {
            this.virtualScrollComponent.updatable = true;
            return;
        }

        /* Variables */

        const activeRowComponents = this.activeRows.toArray();

        const boundariesBeforeTransformation = new Map<string, ReturnType<typeof isElementVisibleInScrollableContainer>>;
        const boundariesAfterTransformation  = new Map<string, ReturnType<typeof isElementVisibleInScrollableContainer>>;

        const columnHeadingWidth = new Map<number, number>();

        /* Measure column headings */

        for ( let columnIndexHeading = 0; columnIndexHeading < this.feColumns.length; columnIndexHeading++ ) {

            const columnEl = this.columnHeadingRef.get( columnIndexHeading )?.nativeElement;

            if ( columnEl === undefined ) {
                continue;
            }

            columnHeadingWidth.set( columnIndexHeading, Math.ceil( columnEl.getBoundingClientRect().width ) );
        }

        /* Helper */

        const getByVisibility = ( type: 'before' | 'after', visible: boolean ) => {
            return Array.from(
                type === 'before' ? boundariesBeforeTransformation : boundariesAfterTransformation
            ).filter(
                ( [ , value ] ) => value.visible === visible
            ).reduce(
                ( acc, item ) => {
                    acc.set( item[ 0 ], item[ 1 ] );
                    return acc;
                },
                new Map<string, ReturnType<typeof isElementVisibleInScrollableContainer>>
            );
        };

        const applyTransformation = ( columnWidths: ReturnType<typeof computeColumnWidths> ) => {

            if ( !this.feColumns ) {
                return;
            }

            for ( let i = 0; i < this.feColumns.length; i++ ) {

                this.renderer.removeStyle( this.hostElement.nativeElement, '--fe-table-' + this.id + '-column-width-' + i );

                const width = columnWidths[ i ];

                if ( width !== undefined ) {
                    this.renderer.setStyle(
                        this.hostElement.nativeElement, '--fe-table-' + this.id + '-column-width-' + i,
                        width + 'px',
                        2
                    );
                }
            }

            this.change.detectChanges();
        };

        /* Measure the boundaries before the new transformation */

        activeRowComponents.forEach( ( component ) => {
            boundariesBeforeTransformation.set(
                component.row.feRowId,
                isElementVisibleInScrollableContainer(
                    component.hostElement.nativeElement,
                    this.virtualScrollElement.nativeElement
                )
            );
        } );

        /* Compute new column widths based on real table */

        let rowsToComputeTheWidth = Array.from( activeRowComponents.values() ).filter(
            ( rowComp ) => boundariesBeforeTransformation.get( rowComp.row.feRowId )?.visible
        ).reduce(
            ( map, rowComp ) => {
                map.set( rowComp.row.feRowId, rowComp );
                return map;
            }, new Map<string, TableRowComponent>()
        );

        let newColumnWidths = computeColumnWidths(
            this,
            this.virtualScrollElement.nativeElement,
            columnHeadingWidth,
            Array.from( rowsToComputeTheWidth.values() )
        );

        /* Apply new transformation */

        applyTransformation( newColumnWidths );

        /* Measure the boundaries after the transformation */

        activeRowComponents.forEach( ( component ) => {
            boundariesAfterTransformation.set(
                component.row.feRowId,
                isElementVisibleInScrollableContainer(
                    component.hostElement.nativeElement,
                    this.virtualScrollElement.nativeElement
                )
            );
        } );

        // const aboveTop = Array.from( boundariesAfterTransformation ).filter( ( item ) => {
        //     return !item[ 1 ].visible && item[ 1 ].bottomAboveContainerTop >= 0;
        // } ).reduce( ( acc, item ) => {
        //     return acc.set( item[ 0 ], item[ 1 ] );
        // }, new Map<string, ReturnType<typeof isElementVisibleInScrollableContainer>> );
        //
        // const belowBottom = Array.from( boundariesAfterTransformation ).filter( ( item ) => {
        //     return !item[ 1 ].visible && item[ 1 ].topBelowContainerBottom >= 0;
        // } ).reduce( ( acc, item ) => {
        //     return acc.set( item[ 0 ], item[ 1 ] );
        // }, new Map<string, ReturnType<typeof isElementVisibleInScrollableContainer>> );
        //
        // if ( this.activeColumnWidths ) {
        //
        //     const beforeInView = getByVisibility( 'before', true );
        //     const afterInView  = getByVisibility( 'after', true );
        //
        //     /* If an item that was previously in view is now after the transformation not in view anymore */
        //
        //     beforeInView.forEach( ( _, id ) => {
        //         if ( !afterInView.has( id ) ) {
        //             if ( belowBottom.has( id ) ) {
        //                 console.log( id, 'was in view before, but will end up below the bottom due to the transformation' );
        //             } else if ( aboveTop.has( id ) ) {
        //                 console.log( id, 'was in view before, but will end up above the top due to the transformation' );
        //             }
        //         }
        //     } );
        // }

        /* Wait for everything to render, then re-measure the rows on the virtual scroll */

        requestAnimationFrame( () => {
            this.virtualScrollComponent.updatable = true;
            this.measureRows.emit( this.activeRows.map( ( row ) => row.hostElement.nativeElement ) );
        } );
    }

    public pointerDown( event: PointerEvent, rowElRef: HTMLElement, index: number ): void {

        /* User clicked on checkbox */
        if ( event.composedPath().find( ( el ) => el instanceof HTMLElement && el.tagName.toLowerCase() === 'fe-checkbox' ) ) {
            return;
        }

        event.preventDefault();

        const scrollableContent = this.virtualScrollElement.nativeElement.parentElement!;

        const dragDummy = rowElRef.cloneNode( true ) as HTMLElement;

        dragDummy.querySelectorAll( 'fe-inline-table' ).forEach( ( el ) => el.remove() );

        this.drag.dummy.element  = dragDummy;
        this.drag.target.element = rowElRef;

        this.drag.offset.y = event.clientY - this.drag.target.element.getBoundingClientRect().top;

        this.renderer.appendChild( scrollableContent, dragDummy );

        this.drag.dummy.element.classList.add( 'dragDummy' );
        this.drag.dummy.element.classList.add( 'animateIn' );

        this.drag.current.index = index;

        if ( !scrollableContent ) {
            return;
        }

        this.drag.dummy.element.style.top = ( event.clientY - scrollableContent.getBoundingClientRect().top - this.drag.offset.y ) + 'px';
    }

    public pointerMove( event: PointerEvent, prevent: boolean ) {

        if ( this.drag.dummy.element === undefined ) {
            return;
        }

        if ( prevent ) {
            event.preventDefault();
        }

        if ( event.clientY !== undefined ) {
            this.lastClientY = event.clientY;
        }

        if ( event.pageX !== undefined && event.pageY ) {
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }

        let isOnRow = false;

        document.elementsFromPoint( this.lastPageX, this.lastPageY ).forEach( ( element ) => {

            element.classList.forEach( ( className ) => {

                if ( className.startsWith( 'fe-table-' + this.id + '-row-' ) ) {

                    const row = +className.substring( ( 'fe-table-' + this.id + '-row-' ).length );

                    isOnRow = true;

                    if ( !this.stillOnRow || row !== this.lastHoveredRow ) {
                        this.lastHoveredRow = row;
                        this.pointerOver( element as HTMLElement, row );
                    }
                }
            } );
        } );

        if ( !isOnRow && this.stillOnRow ) {
            this.stillOnRow = false;
        }

        if ( isOnRow && !this.stillOnRow ) {
            this.stillOnRow = true;
        }

        const scrollableContent = this.virtualScrollElement.nativeElement;

        if ( !scrollableContent ) {
            return;
        }

        this.drag.dummy.element.style.top = ( this.lastClientY - scrollableContent.getBoundingClientRect().top - this.drag.offset.y ) + 'px';
    }

    public pointerUp( event: PointerEvent ) {

        if ( this.drag.dummy.element === undefined || this.drag.target.element === undefined ) {
            return;
        }

        if ( this.resolvedSearchResultData !== undefined ) {
            return;
        }

        event.preventDefault();

        const fromIndex = this.drag.current.index;
        let toIndex!: number;

        if ( this.drag.direction === 'up' ) {

            /* Needs to appear before the target */

            toIndex = this.drag.target.index;

        } else if ( this.drag.direction === 'down' ) {

            /* Needs to appear after the target */

            toIndex = this.drag.target.index + 1;
        }

        if ( this.drag.target.index > this.drag.current.index ) {

            /* Dragged below its initial position */

            toIndex -= 1;

        } else if ( this.drag.target.index < this.drag.current.index ) {

            /* Dragged above its initial position */

            toIndex += 0;

        } else {

            /* Dragged to its initial position */

            toIndex += 0;
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

        this.drag.last.index    = toIndex;
        this.drag.offset.y      = 0;
        this.drag.current.index = NaN;
        this.drag.target.index  = NaN;

        this.drag.dummy.element.remove();

        this.drag.dummy.element  = undefined;
        this.drag.target.element = undefined;

        this.change.detectChanges();

        if ( this.resolvedUnaffectedData !== undefined ) {
            this.feOnReorder.emit( this.resolvedUnaffectedData );
        }
    }

    public pointerOver( element: HTMLElement, index: number ) {

        if ( this.drag.dummy.element === undefined ) {
            return;
        }

        if ( this.drag.dummy.element === element ) {
            return;
        }

        /* Find in which direction the user is currently dragging */
        if ( this.drag.target.index < index ) {
            this.drag.direction = 'down';
        } else if ( this.drag.target.index > index ) {
            this.drag.direction = 'up';
        } else {
            /* Element moved away but the user still ended up on the same item, this tells us that the user changed direction to the opposite */
            this.drag.direction = this.drag.direction === 'down' ? 'up' : 'down';
        }

        this.drag.target.index = index;

        this.change.detectChanges();
    }

    private conductSearch( term: string ) {

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

                const parts = term.toLowerCase().split( ' ' );

                const matches = this.resolvedUnaffectedData.filter( ( record ) => {

                    const find = ( obj: Record<string, any> | undefined | null ) => {

                        if ( obj === undefined || obj === null ) {
                            return false;
                        }

                        for ( const key of Object.keys( obj ) ) {

                            if ( typeof obj[ key ] === 'string' || typeof obj[ key ] === 'number' ) {

                                let partsFound = 0;

                                for ( let part of parts ) {
                                    if ( String( obj[ key ] ).toLowerCase().search( new RegExp( escapeRegExp( part ), 'g' ) ) !== -1 ) {
                                        partsFound++;
                                    }
                                }

                                if ( partsFound === parts.length ) {
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

        this.change.detectChanges();

        if ( this.virtualScrollElement ) {
            this.virtualScrollElement.nativeElement.scrollTop  = 0;
            this.virtualScrollElement.nativeElement.scrollLeft = 0;
        }
    }

    /* Helpers */

    protected readonly getPath = lodash.get;

    protected readonly isNaN = isNaN;

    protected readonly NaN = () => NaN;

    protected readonly Math = Math;

    protected readonly feTrackRow = feTrackRow;

    public compareRows<T extends { feRowId: string }>( row1: T, row2: T ): boolean {
        return row1.feRowId === row2.feRowId;
    }

    public get reorderable(): boolean {
        return this.feReorderable && this.resolvedSearchResultData === undefined;
    }

    /* If a search is active, this property is the filtered result otherwise it is just the resolved unaffected data */
    public get resolvedRelevantData(): ComputedTableRow[] | undefined {
        return this.resolvedSearchResultData ?? this.resolvedUnaffectedData;
    }

    public get isScrollable() {

        const scroller = this.virtualScrollElement?.nativeElement;

        if ( !scroller ) {
            return false;
        }

        return scroller.scrollHeight > scroller.clientHeight;
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
}
