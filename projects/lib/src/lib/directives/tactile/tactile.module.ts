import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TactileDirective } from './tactile.directive';

@NgModule( {
    
               declarations: [
                   TactileDirective
               ],
    
               imports: [
                   CommonModule
               ],
    
               exports: [
                   TactileDirective
               ]
           } )

export class FeTactileModule {}
