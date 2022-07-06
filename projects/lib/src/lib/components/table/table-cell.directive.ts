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

    @Input( 'fe-table-cell' )
    public info!: { index: number, idealWidthEl: HTMLElement, minWidthEl: HTMLElement };

    public get idealWidth(): number {
        return this.info.idealWidthEl.getBoundingClientRect().width;
    }

    public get minWidth(): number {
        return this.info.minWidthEl.scrollWidth;
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }
}
