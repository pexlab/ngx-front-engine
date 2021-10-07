import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AlertPortalComponent } from './alert-portal.component';

@NgModule(
    {
        declarations: [
            AlertPortalComponent
        ],
        
        imports: [
            CommonModule,
            AngularSvgIconModule
        ],
        
        exports: [
            AlertPortalComponent
        ]
    }
)

export class FeAlertPortalModule {}
