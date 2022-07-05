import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive(
    {
        selector: '[fe-table-cell]',
        exportAs: 'cellDirective'
    }
)

export class TableCellDirective implements OnInit, OnDestroy {

    constructor( public hostElement: ElementRef<HTMLElement> ) {
    }

    @Input('fe-table-cell')
    public info!: {index: number, measurementEl: HTMLElement};

    public get width(): number {
        return this.info.measurementEl.getBoundingClientRect().width;
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }
}
