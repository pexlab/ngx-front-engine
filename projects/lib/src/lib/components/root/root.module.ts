import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';

@NgModule(
    {
        declarations: [
            RootComponent
        ],
        
        imports: [
            CommonModule
        ],
        
        exports: [
            RootComponent
        ]
    }
)

export class FeRootModule {}
