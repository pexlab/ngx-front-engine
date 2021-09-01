import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { ButtonComponent } from './button.component';

@NgModule(
    {
        declarations: [
            ButtonComponent
        ],
        
        imports: [
            CommonModule,
            FeTactileModule
        ],
        
        exports: [
            ButtonComponent
        ]
    }
)

export class FeButtonModule {}
