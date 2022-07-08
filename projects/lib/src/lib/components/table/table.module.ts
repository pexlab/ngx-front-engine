import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeButtonModule } from '../button/button.module';
import { FeCheckboxModule } from '../checkbox/checkbox.module';
import { TableCellRendererDirective } from './table-cell-renderer.directive';
import { TableCellDirective } from './table-cell.directive';
import { TableComponent } from './table.component';

@NgModule( {
    declarations: [
        TableComponent,
        TableCellDirective,
        TableCellRendererDirective
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FeCheckboxModule,
        FeButtonModule,
        ScrollingModule
    ],
    exports     : [
        TableComponent
    ]
} )
export class TableModule {}
