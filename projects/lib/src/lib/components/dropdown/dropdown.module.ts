import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { DropdownChoiceComponent } from './choice/dropdown-choice.component';
import { DropdownComponent } from './dropdown.component';

@NgModule(
    {
        declarations: [
            DropdownComponent,
            DropdownChoiceComponent
        ],
        
        imports: [
            CommonModule,
            FeTactileModule,
            AngularSvgIconModule
        ],
        
        exports: [
            DropdownComponent,
            DropdownChoiceComponent
        ]
    }
)

export class FeDropdownModule {}
