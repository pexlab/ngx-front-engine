import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { TextFieldComponent } from './text-field.component';

@NgModule(
    {
        declarations: [
            TextFieldComponent
        ],

        imports: [
            CommonModule,
            AngularSvgIconModule,
            FeTactileModule
        ],

        exports: [
            TextFieldComponent
        ]
    }
)
export class FeTextFieldModule {}
