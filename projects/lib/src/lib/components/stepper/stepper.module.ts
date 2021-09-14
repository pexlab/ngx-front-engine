import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { StepperComponent } from './stepper.component';

@NgModule(
    {
        declarations: [
            StepperComponent
        ],
        
        imports: [
            CommonModule,
            FeTactileModule,
            AngularSvgIconModule
        ],
        
        exports: [
            StepperComponent
        ]
    }
)

export class FeStepperModule {}
