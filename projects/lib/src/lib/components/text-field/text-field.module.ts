import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextFieldComponent } from './text-field.component';

@NgModule(
    {
        declarations: [
            TextFieldComponent
        ],
        
        imports: [
            CommonModule
        ],
        
        exports: [
            TextFieldComponent
        ]
    }
)
export class FeTextFieldModule {}
