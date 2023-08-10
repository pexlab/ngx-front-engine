import { ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { get } from 'lodash-es';
import { TableCellDirective } from '../../table-cell.directive';
import { ComputedTableRow, TableLike } from '../../table.utils';

@Component(
    {
        selector       : 'fe-inline-table-row',
        templateUrl    : './inline-table-row.component.html',
        styleUrls      : [ './inline-table-row.component.scss' ]
    }
)
export class InlineTableRowComponent {

    constructor(
        public hostElement: ElementRef<HTMLElement>,
        public change: ChangeDetectorRef
    ) {
    }

    @Input( 'feRow' )
    public row!: ComputedTableRow;

    @Input( 'feTable' )
    public table!: TableLike;

    @ViewChildren( 'cell' )
    public cells!: QueryList<TableCellDirective>;

    public get drag() {
        return this.table.drag;
    }

    protected readonly isNaN   = isNaN;
    protected readonly Math    = Math;
    protected readonly getPath = get;

    public get dragTargetToIndex(): number {

        let toIndex = this.drag.target.index + ( this.drag.target.index >= this.drag.current.index ? 0 : this.drag.direction === 'down' ? 1 : 0 );

        if ( toIndex > this.drag.current.index && this.drag.direction === 'down' ) {
            toIndex += 1;
        }

        return toIndex;
    }

    public animateRowIn( row: number ) {

        setTimeout( () => {
            if ( this.drag.last.index === row ) {
                this.drag.last.index = NaN;
            }
        }, 1050 );

        return true;
    }
}
