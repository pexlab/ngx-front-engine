import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { CommentComponent } from './comment.component';

@NgModule(
    {
        declarations: [
            CommentComponent
        ],
    
        imports: [
            CommonModule,
            AngularSvgIconModule,
            FeTactileModule
        ],
        
        exports: [
            CommentComponent
        ]
    }
)

export class CommentModule {}
