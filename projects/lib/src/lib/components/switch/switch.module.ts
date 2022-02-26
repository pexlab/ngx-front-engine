import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { SwitchComponent } from './switch.component';

@NgModule(
    {
        declarations: [
            SwitchComponent
        ],
        
        imports: [
            CommonModule,
            FeTactileModule,
            AngularSvgIconModule
        ],
        
        exports: [
            SwitchComponent
        ]
    }
)

export class FeSwitchModule {}
