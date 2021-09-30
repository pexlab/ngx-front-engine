import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class SpeedometerModule {}
