import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { FeButtonModule } from '../button/button.module';
import { BannerCarouselComponent } from './banner-carousel.component';

@NgModule(
    {
        declarations: [
            BannerCarouselComponent
        ],

        imports: [
            CommonModule,
            RouterModule,
            FeTactileModule,
            AngularSvgIconModule,
            FeButtonModule
        ],

        exports: [
            BannerCarouselComponent
        ]
    }
)

export class FeBannerCarouselModule {}
