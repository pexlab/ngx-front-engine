import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { MarkdownComponent } from '../markdown/markdown.component';
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
            MarkdownComponent
        ],

        exports: [
            CommentComponent
        ]
    }
)

export class CommentModule {}
