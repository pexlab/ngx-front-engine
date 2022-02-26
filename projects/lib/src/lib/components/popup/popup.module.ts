import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { PopupComponent } from './popup.component';

@NgModule(
    {
        declarations: [
            PopupComponent
        ],
        
        imports: [
            CommonModule,
            FeTactileModule,
            AngularSvgIconModule
        ],
        
        exports: [
            PopupComponent
        ]
    }
)

export class FePopupModule {}
