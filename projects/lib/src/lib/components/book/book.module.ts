import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeTactileModule } from '../../directives/tactile/tactile.module';
import { BookComponent } from './book.component';

@NgModule( {

	declarations: [
		BookComponent
	],

    imports: [
        CommonModule,
        FeTactileModule
    ],

	exports: [
		BookComponent
	]
} )

export class BookModule {
}
