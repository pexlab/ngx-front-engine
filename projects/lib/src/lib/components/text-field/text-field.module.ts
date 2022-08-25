import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TextFieldComponent } from './text-field.component';

@NgModule(
    {
        declarations: [
            TextFieldComponent
        ],

        imports: [
            CommonModule,
            AngularSvgIconModule
        ],

        exports: [
            TextFieldComponent
        ]
    }
)
export class FeTextFieldModule {}
