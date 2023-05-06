import { EventEmitter, QueryList } from '@angular/core';
import { z } from 'zod';
import { ComponentTheme } from '../../interfaces/color.interface';
import { remToPixels } from '../../utils/element.utils';
import { PartialInlineTableTheme } from './inline/inline-table.theme';
import { TableCellDirective } from './table-cell.directive';
import { PartialTableTheme } from './table.theme';

export type ComputedTableRow = {
    [ key: string ]: any,
    feRowId: string,
    feIndex: number,
    feItemIndex: number,
    feInitialIndex: number,
    feInitialItemIndex: number
}

const ZTableColumnLabel = z.union(
    [
        z.object(
            {
                icon: z.string(),
                text: z.string()
            }
        ),
        z.object(
            {
                icon: z.undefined(),
                text: z.string()
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
        onClick         : z.function().args( z.record( z.any() ) ).returns( z.void() ).optional(),
        collapsible     : z.boolean().default( false ).optional()
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
            onClick         : z.function().args( z.record( z.any() ) ).returns( z.void() ).optional(),
            collapsible     : z.boolean().default( false ).optional()
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

export interface TableLike {
    feOnReorder: EventEmitter<{ [ key: string ]: any }[]>,
    feTheme: ComponentTheme<PartialTableTheme> | undefined,
    feColumns: TableColumn[] | undefined,
    feReorderable: boolean,
    feSelectable: boolean,
    drag: {
        current: {
            index: number
        },
        target: {
            index: number,
            element: HTMLElement | undefined
        },
        last: {
            index: number
        },
        dummy: {
            element: HTMLElement | undefined
        },
        direction: 'up' | 'down',
        offset: {
            y: number
        }
    },
    inlineTables?: Map<number, {
        feTheme?: ComponentTheme<PartialInlineTableTheme>,
        feColumns: TableColumn[],
        feData: { [ key: string ]: any }[],
        feReorderable?: boolean,
        feOnReorder?: EventEmitter<{ [ key: string ]: any }[]>,
        feSelectable?: boolean,
    }>,
    id: string,
    highlightedColumnIndex: number,
    reorderable: boolean,
    pointerDown: ( event: PointerEvent, rowElRef: HTMLElement, index: number ) => any,
    resolvedRelevantData: ComputedTableRow[] | undefined,
    isScrollable: boolean,
}

export interface TableRowLike {
    cells: QueryList<TableCellDirective>;
}

export const computeColumnWidths = (
    table: TableLike,
    container: HTMLElement,
    headingWidths: Map<number, number>,
    rows: TableRowLike[]
): number[] => {

    const cells: TableCellDirective[] = rows.map( row => row.cells.toArray() ).flat();

    const naturalWidths: number[] = [];
    const minimumWidths: number[] = [];

    /* Find out the natural and minimum widths for all columns */

    headingWidths.forEach( ( width, column ) => {
        naturalWidths[ column ] = width;
        minimumWidths[ column ] = width;
    } );

    for ( const cell of cells ) {

        const column              = cell.info.index;
        const currentNaturalWidth = Math.ceil( cell.idealWidth );
        const currentMinimumWidth = Math.ceil( cell.minWidth );

        /* The natural width of the whole column should be the largest natural width out of all the cells */
        if ( naturalWidths[ column ] === undefined || naturalWidths[ column ] < currentNaturalWidth ) {
            naturalWidths[ column ] = currentNaturalWidth;
        }

        /* The minimum width of the whole column should be the largest minimum width out of all the cells */
        /* The guarantees that the largest minimum is respected */
        if ( minimumWidths[ column ] === undefined || currentMinimumWidth > minimumWidths[ column ] ) {
            minimumWidths[ column ] = currentMinimumWidth;
        }

        /* The natural width must be bigger or equal to the minimum */
        if ( naturalWidths[ column ] < minimumWidths[ column ] ) {
            naturalWidths[ column ] = minimumWidths[ column ];
        }
    }

    /* Collapse collapsible columns up to the minimum width, if a horizontal surplus arises */

    const aggregatedWidth =
              naturalWidths.reduce( ( a, b ) => a + b, 0 ) +
              ( remToPixels( 0.8 * 2 ) * naturalWidths.length ) +
              ( naturalWidths.length + 1 ) +
              ( table.feReorderable ? remToPixels( 1.2 + ( 0.8 * 2 ) ) : 0 ) +
              ( table.feSelectable ? remToPixels( 2 + ( 0.8 * 2 ) ) + 18 : 0 ) +
              ( table.feReorderable || table.feSelectable ? 1 : 0 );

    let surplus = aggregatedWidth - container.clientWidth;

    if ( surplus > 0 ) {

        let collapsibleColumns   = table.feColumns!.filter( ( column ) => column.collapsible ).length;
        let balancedCompensation = Math.ceil( surplus / collapsibleColumns );

        const alreadyAddressed: number[] = [];

        table.feColumns!.forEach( ( column, index ) => {

            if ( !column.collapsible ) {
                return;
            }

            const minimumWidth = minimumWidths[ index ];
            const newWidth     = naturalWidths[ index ] - balancedCompensation;

            if ( newWidth < minimumWidth ) {

                surplus -= naturalWidths[ index ] - minimumWidth;

                naturalWidths[ index ] = minimumWidth;

                collapsibleColumns -= 1;
                balancedCompensation = collapsibleColumns > 0 ? Math.ceil( surplus / collapsibleColumns ) : 0;

                alreadyAddressed.push( index );
            }
        } );

        table.feColumns!.forEach( ( column, index ) => {

            if ( !column.collapsible || alreadyAddressed.includes( index ) ) {
                return;
            }

            naturalWidths[ index ] = Math.max( naturalWidths[ index ] - balancedCompensation, minimumWidths[ index ] );
        } );
    }

    return naturalWidths;
};

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
