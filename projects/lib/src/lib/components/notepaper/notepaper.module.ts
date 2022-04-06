import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { FeButtonModule } from '../button/button.module';
import { NotepaperComponent } from './notepaper.component';

@NgModule(
    {
        declarations: [
            NotepaperComponent
        ],

        imports: [
            CommonModule,
            FeTactileModule,
            FeButtonModule
        ],

        exports: [
            NotepaperComponent
        ]
    }
)

export class FeNotepaperModule {}
