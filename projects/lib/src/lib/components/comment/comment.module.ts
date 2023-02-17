import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MarkdownModule } from 'ngx-markdown';
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
            FeTactileModule,
            MarkdownModule.forRoot(),
        ],
        
        exports: [
            CommentComponent
        ]
    }
)

export class CommentModule {}
