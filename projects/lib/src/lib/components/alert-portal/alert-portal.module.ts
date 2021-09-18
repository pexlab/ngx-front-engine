import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HighlightModule } from 'ngx-highlightjs';
import { AlertPortalComponent } from './alert-portal.component';

@NgModule(
    {
        declarations: [
            AlertPortalComponent
        ],
        
        imports: [
            CommonModule,
            AngularSvgIconModule,
            HighlightModule
        ],
        
        exports: [
            AlertPortalComponent
        ]
    }
)

export class FeAlertPortalModule {}
