import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeButtonModule } from '../button/button.module';
import { FeCheckboxModule } from '../checkbox/checkbox.module';
import { FeVirtualScrollModule } from '../virtual-scroll/virtual-scroll.module';
import { InlineTableRowComponent } from './inline/inline-row/inline-table-row.component';
import { InlineTableComponent } from './inline/inline-table.component';
import { TableRowComponent } from './row/table-row.component';
import { TableCellRendererDirective } from './table-cell-renderer.directive';
import { TableCellDirective } from './table-cell.directive';
import { TableComponent } from './table.component';

@NgModule( {
    declarations: [
        TableComponent,
        InlineTableComponent,
        TableCellDirective,
        TableCellRendererDirective,
        TableRowComponent,
        InlineTableRowComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FeCheckboxModule,
        FeButtonModule,
        FeVirtualScrollModule,
        AsyncPipe,
    ],
    exports     : [
        TableComponent,
        InlineTableComponent
    ]
} )
export class TableModule {}
