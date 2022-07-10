import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BookComponent } from './book.component';

@NgModule( {

	declarations: [
		BookComponent
	],

	imports: [
		CommonModule
	],

	exports: [
		BookComponent
	]
} )

export class BookModule {
}
