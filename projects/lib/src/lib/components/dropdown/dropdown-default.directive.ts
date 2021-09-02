import { Directive } from '@angular/core';
import { DropdownChoiceComponent } from './choice/dropdown-choice.component';

@Directive( {
    selector: '[fe-dropdown-default]'
} )

export class DropdownDefaultInputDirective {

    constructor( public host: DropdownChoiceComponent ) {}
}
