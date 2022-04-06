import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeButtonModule } from '../button/button.module';
import { FeCheckboxModule } from '../checkbox/checkbox.module';
import { TableComponent } from './table.component';

@NgModule( {
    declarations: [
        TableComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FeCheckboxModule,
        FeButtonModule
    ],
    exports     : [
        TableComponent
    ]
} )
export class TableModule {}
