import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpeedometerComponent } from './speedometer.component';

@NgModule(
    {
        
        declarations: [
            SpeedometerComponent
        ],
        
        imports: [
            CommonModule
        ],
        
        exports: [
            SpeedometerComponent
        ]
    }
)
export class FeSpeedometerModule {}
