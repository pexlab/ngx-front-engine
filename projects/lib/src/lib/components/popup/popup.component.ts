import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as focusTrap from 'focus-trap';
import { Subject } from 'rxjs';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { fes, rawFes, rawVh, rawVw } from '../../utils/unit.utils';
import { PartialPopupTheme } from './popup.theme';

@FeComponent( 'popup' )
@Component(
    {
        templateUrl: './popup.component.html',
        styleUrls  : [ './popup.component.scss' ]
    }
)
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        public hostElement: ElementRef,
        private renderer: Renderer2
    ) {
    }

    public feTheme!: ComponentTheme<PartialPopupTheme>;

    public hideExitIcon!: boolean;
    public title!: string;

    public set width( value: { minWidth?: string, width?: string, maxWidth?: string } ) {

        const clamp = value.width === undefined ?
                      'fit-content' :
                      isNaN( +value.width ) ?
                      value.width :
                      fes( +value.width );

        const clampMin = value.minWidth === undefined ?
                         'min(' + clamp + ', calc(' + rawVw( 100 ) + ' - ' + rawFes( 2.5 ) + '))' :
                         isNaN( +value.minWidth ) ?
                         value.minWidth :
                         fes( +value.minWidth );

        const clampMax = value.maxWidth === undefined ?
                         'calc(' + rawVw( 100 ) + ' - ' + rawFes( 2.5 ) + ')' :
                         isNaN( +value.maxWidth ) ?
                         value.maxWidth :
                         fes( +value.maxWidth );

        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-width-min', clampMin, 2 );
        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-width', clamp, 2 );
        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-width-max', clampMax, 2 );
    }

    public set height( value: { minHeight?: string, height?: string, maxHeight?: string } ) {

        const clamp = value.height === undefined ?
                      'fit-content' :
                      isNaN( +value.height ) ?
                      value.height :
                      fes( +value.height );

        const clampMin = value.minHeight === undefined ?
                         'min(' + clamp + ', calc(' + rawVh( 100 ) + ' - ' + rawFes( 2.5 ) + '))' :
                         isNaN( +value.minHeight ) ?
                         value.minHeight :
                         fes( +value.minHeight );

        const clampMax = value.maxHeight === undefined ?
                         'calc(' + rawVh( 100 ) + ' - ' + rawFes( 2.5 ) + ')' :
                         isNaN( +value.maxHeight ) ?
                         value.maxHeight :
                         fes( +value.maxHeight );

        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-height-min', clampMin, 2 );
        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-height', clamp, 2 );
        this.renderer.setStyle( this.hostElement.nativeElement, '--popup-height-max', clampMax, 2 );
    }

    public set kind( value: 'mobile' | 'desktop' ) {

        if ( value === 'mobile' ) {
            this.containerRef.nativeElement.classList.add( 'fe-mobile' );
        } else {
            this.containerRef.nativeElement.classList.remove( 'fe-mobile' );
        }

        if ( value === 'desktop' ) {
            this.containerRef.nativeElement.classList.add( 'fe-desktop' );
        } else {
            this.containerRef.nativeElement.classList.remove( 'fe-desktop' );
        }
    }

    /* Any other values than 'fe-open' or 'fe-close' get redirected to onTransmit method when creating a popup through the service */
    public popupObserver: Subject<'fe-init' | 'fe-open' | 'fe-close' | any> = new Subject();

    @ViewChild( 'content', { read: ViewContainerRef, static: false } )
    public viewContainer!: ViewContainerRef;

    @ViewChild( 'container' )
    public containerRef!: ElementRef<HTMLElement>;

    @ViewChild( 'contentWrapper' )
    public contentWrapperRef!: ElementRef<HTMLElement>;

    private visibility!: 'visible' | 'hidden';

    private focusTrap!: focusTrap.FocusTrap;

    public ngOnInit(): void {

        if ( !this.hideExitIcon ) {
            this.hideExitIcon = false;
        }

        if ( !this.title ) {
            throw new Error( 'Title hasn\'t been set for popup-component' );
        }

        this.popupObserver.next( 'fe-init' );
    }

    public ngAfterViewInit(): void {

        this.focusTrap = focusTrap.createFocusTrap( this.containerRef.nativeElement, {
            initialFocus: false
        } );
        this.focusTrap.activate();

        /* As soon as every component gets interactive, open the popup */
        setTimeout( () => {

            this.setVisibility( 'visible' );

            /* Wait for animation to finish */
            setTimeout( () => {

                /* Make sure it has not been closed until now */
                if ( this.visibility === 'visible' ) {
                    this.popupObserver.next( 'fe-open' );
                }

            }, 500 );
        } );
    }

    public ngOnDestroy(): void {
        this.focusTrap.deactivate();
    }

    public close(): void {
        this.popupObserver.next( 'fe-close' );
    }

    public setVisibility( value: 'visible' | 'hidden' ): void {
        this.visibility = value;
        this.hostElement.nativeElement.classList.add( value );
        this.hostElement.nativeElement.classList.remove( value === 'visible' ? 'hidden' : 'visible' );
    }

    public getVisibility(): 'visible' | 'hidden' {
        return this.visibility;
    }
}
