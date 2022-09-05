import { Directive, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive( {
    selector: '[formControl], [formControlName]'
} )
export class NativeElementInjectorDirective implements OnInit, OnChanges {

    constructor(
        private controlDirective: NgControl
    ) {
    }

    public ngOnInit(): void {
        ( this.controlDirective.control as any )[ 'component' ] = this.controlDirective.valueAccessor;
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        ( this.controlDirective.control as any )[ 'component' ] = this.controlDirective.valueAccessor;
    }
}
