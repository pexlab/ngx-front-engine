import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';

@Directive(
    {
        selector: '[fe-table-cell-renderer]',
        exportAs: 'cellRendererDirective'
    }
)

export class TableCellRendererDirective implements OnInit, OnDestroy {

    constructor(
        public hostElement: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef,
        private factory: ComponentFactoryResolver
    ) {
    }

    public renderedComponent?: ComponentRef<any>;
    public renderedText?: HTMLSpanElement;

    private renderOptions?: { property: string, renderer: undefined } | { renderer: any, property: any };

    @Input( 'fe-table-cell-renderer' )
    public set options( value: { property: string, renderer: undefined } | { renderer: any, property: any } ) {

        this.renderOptions = value;

        if ( !this.hasBeenInitialized ) {
            return;
        }

        /* Remove if type has switched */

        if ( value.renderer === undefined && this.renderedComponent !== undefined ) {
            this.renderedComponent.destroy();
            this.renderedComponent = undefined;
        }

        if ( value.renderer !== undefined && this.renderedText !== undefined ) {
            this.renderedText.remove();
            this.renderedText = undefined;
        }

        /* Create if type has switched */

        if ( ( value.renderer === undefined && this.renderedText === undefined ) || ( value.renderer !== undefined && this.renderedComponent === undefined ) ) {

            this.ngOnInit();

        } else {

            /* Update if type has not switched */

            if ( this.renderedComponent !== undefined ) {

                this.renderedComponent.instance[ 'feTableProperty' ] = value.property;

            } else if ( this.renderedText !== undefined ) {

                this.renderedText.innerText = value.property ?? '–';
            }
        }
    }

    public hasBeenInitialized = false;

    public ngOnInit(): void {

        if ( !this.renderOptions ) {
            throw new Error( 'No render options have been provided for cell renderer directive' );
        }

        this.hasBeenInitialized = true;

        if ( this.renderOptions.renderer === undefined ) {

            const span: HTMLSpanElement = this.renderer.createElement( 'span' );
            span.innerText              = this.renderOptions.property ?? '–';

            this.renderer.appendChild( this.hostElement.nativeElement.parentElement, span );

            this.renderedText = span;

        } else {

            this.renderedComponent = this.viewContainerRef.createComponent(
                this.factory.resolveComponentFactory( this.renderOptions.renderer )
            );

            this.renderedComponent.instance[ 'feTableProperty' ] = this.renderOptions.property;
        }

    }

    public ngOnDestroy(): void {

        if ( this.renderedComponent !== undefined ) {

            this.renderedComponent.destroy();

        } else if ( this.renderedText !== undefined ) {

            this.renderedText.remove();
        }
    }
}
