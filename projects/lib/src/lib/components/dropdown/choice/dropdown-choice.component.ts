import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AsynchronouslyInitialisedComponent } from '../../../utils/component.utils';

@Component(
    {
        selector : 'fe-dropdown-choice',
        template : `
            <ng-template #placeholderTemplateRef>
                <ng-content select="[fePlaceholder]"></ng-content>
            </ng-template>

            <ng-template #contentTemplateRef>
                <ng-content select="[feContent]"></ng-content>
            </ng-template>

            <ng-container *ngTemplateOutlet="contentAndPlaceholderRef || contentTemplateRef"></ng-container>`,
        styleUrls: [ './dropdown-choice.component.scss' ]
    }
)
export class DropdownChoiceComponent extends AsynchronouslyInitialisedComponent implements OnInit {

    constructor( public hostElement: ElementRef<HTMLElement> ) {
        super();
    }

    @ContentChild( TemplateRef )
    public contentAndPlaceholderRef!: TemplateRef<void>;

    @Input()
    public feKey!: string;

    @Input()
    public feValue!: string;

    @Output()
    public feOnSelect = new EventEmitter<void>();

    private hasBeenInitialised = false;
    private _placeholderRef!: TemplateRef<void>;
    private _contentRef!: TemplateRef<void>;

    private touchRadiusX = 0;
    private touchRadiusY = 0;

    @ViewChild( 'placeholderTemplateRef' )
    public set placeholderRef( value: TemplateRef<void> ) {

        this._placeholderRef = value;

        if ( !this.hasBeenInitialised ) {
            this.componentLoaded();
            this.hasBeenInitialised = true;
        }
    }

    @ViewChild( 'contentTemplateRef' )
    public set contentRef( value: TemplateRef<void> ) {

        this._contentRef = value;

        if ( !this.hasBeenInitialised ) {
            this.componentLoaded();
            this.hasBeenInitialised = true;
        }
    }

    public get placeholderRef(): TemplateRef<void> {
        return this._placeholderRef;
    }

    public get contentRef(): TemplateRef<void> {
        return this._contentRef;
    }

    // Note: This borrows the logic from the tactile directive.
    // TODO: As soon as directives can be added to host elements, this can be removed.

    private heldDown = false;

    @HostListener( 'click' )
    public onSelect(): void {
        this.feOnSelect.emit();
    }

    @HostListener( 'touchstart', [ '$event' ] )
    public onTouchStart( event: TouchEvent ): void {

        this.touchRadiusX = event.touches[ 0 ].radiusX ?? 0;
        this.touchRadiusY = event.touches[ 0 ].radiusY ?? 0;

        this.onPointerDown( event );
    }

    @HostListener( 'pointerdown', [ '$event' ] )
    public onPointerDown( event: PointerEvent | TouchEvent ): void {

        if ( this.heldDown ) {
            return;
        }

        if ( !event.cancelable ) {
            return;
        }

        if ( ( event as any ).pointerType && ( event as any ).pointerType === 'touch' ) {
            return;
        }

        event.preventDefault();

        this.heldDown = true;

        this.hostElement.nativeElement.classList.add( 'hoverState' );
    }

    @HostListener( 'document:pointerup', [ '$event' ] )
    public onPointerUp( event: PointerEvent ): void {

        if ( !this.heldDown ) {
            return;
        }

        this.heldDown = false;

        this.hostElement.nativeElement.classList.remove( 'hoverState' );

        /* If the mouse is not on the component anymore, ignore the click. Most users behave this way, if they accidentally clicked. */
        if ( this.isOnHostElement( event ) ) {
            if ( this.hostElement.nativeElement.click !== undefined ) {
                this.hostElement.nativeElement.click();
            }
        }
    }

    @HostListener( 'document:touchcancel' )
    public onTouchCancel(): void {
        this.heldDown = false;
    }

    public ngOnInit(): void {
        if ( !this.feValue ) {
            throw new Error( 'Value missing on dropdown choice' );
        }
    }

    private isOnHostElement( event: PointerEvent ): boolean {

        /* Difference caused by the transform effect */
        const widthDifference  = this.hostElement.nativeElement.offsetWidth - this.hostElement.nativeElement.getBoundingClientRect().width;
        const heightDifference = this.hostElement.nativeElement.offsetHeight - this.hostElement.nativeElement.getBoundingClientRect().height;

        const radiusX = event.pointerType === 'touch' ? this.touchRadiusX : 0;
        const radiusY = event.pointerType === 'touch' ? this.touchRadiusY : 0;

        const hostXStart = this.hostElement.nativeElement.getBoundingClientRect().left - ( widthDifference / 2 ) - radiusX;
        const hostYStart = this.hostElement.nativeElement.getBoundingClientRect().top - ( heightDifference / 2 ) - radiusY;
        const hostXEnd   = this.hostElement.nativeElement.getBoundingClientRect().right + ( widthDifference / 2 ) + radiusX;
        const hostYEnd   = this.hostElement.nativeElement.getBoundingClientRect().bottom + ( heightDifference / 2 ) + radiusY;

        const pointerX = event.clientX;
        const pointerY = event.clientY;

        return !( pointerX < hostXStart || pointerX > hostXEnd || pointerY < hostYStart || pointerY > hostYEnd );
    }
}
