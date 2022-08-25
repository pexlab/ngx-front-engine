import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { CheckboxComponent } from './checkbox.component';

@NgModule(
    {
        declarations: [
            CheckboxComponent
        ],

        imports: [
            CommonModule,
            AngularSvgIconModule,
            FeTactileModule
        ],

        exports: [
            CheckboxComponent
        ]
    }
)

export class FeCheckboxModule {}
