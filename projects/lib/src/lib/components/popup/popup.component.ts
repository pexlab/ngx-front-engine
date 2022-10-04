import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ComponentRef, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
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
        styleUrls  : [ './popup.component.scss' ],
        animations : [
            trigger( 'title', [
                transition( '* <=> *', [
                    style( { height: '{{ prevHeight }}' } ),
                    query( ':enter', [
                        style( { position: 'fixed', display: 'none', pointerEvents: 'none', opacity: 0 } )
                    ], { optional: true } ),
                    query( ':leave', [
                        style( { pointerEvents: 'none' } ),
                        animate( '0.5s ease-out', style( { opacity: 0 } ) ),
                        style( { position: 'fixed', display: 'none' } )
                    ], { optional: true } ),
                    group( [
                        animate( '0.5s ease-out', style( { height: '*' } ) ),
                        query( ':enter', [
                            style( { position: 'static', display: 'block', opacity: 0 } ),
                            animate( '0.5s .25s ease-out', style( { opacity: 1 } ) ),
                            style( { pointerEvents: 'visible' } )
                        ], { optional: true } )
                    ] )
                ], { params: { prevHeight: 'auto' } } )
            ] )
        ]
    }
)
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        public hostElement: ElementRef,
        private renderer: Renderer2
    ) {
    }

    public feTheme!: ComponentTheme<PartialPopupTheme>;

    public hideExitIcon: boolean = false;

    public set title( value: string ) {

        this.titleAnimation = {
            value : value,
            params: { prevHeight: this.titleSpanRef && this.titleBarRef ? this.titleBarRef.nativeElement.getBoundingClientRect().height + 'px' : 'auto' }
        };
        this.titleStr       = value;

        /* Enable animation after initial title was set */
        if ( !this.titleAnimationEnabled ) {
            setTimeout( () => {
                this.titleAnimationEnabled = true;
            } );
        }
    }

    public titleAnimation?: { value: string, params: { prevHeight: string } };
    public titleStr?: string;
    public titleAnimationEnabled = false;

    public injectedComponentRef?: ComponentRef<any>;

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
            this.titleBarRef.nativeElement.classList.add( 'fe-mobile' );
            this.iconRef.nativeElement.classList.add( 'fe-mobile' );
            this.titleSpanRef.nativeElement.classList.add( 'fe-mobile' );
            this.contentWrapperRef.nativeElement.classList.add( 'fe-mobile' );
            this.contentRef.nativeElement.classList.add( 'fe-mobile' );
        } else {
            this.containerRef.nativeElement.classList.remove( 'fe-mobile' );
            this.titleBarRef.nativeElement.classList.remove( 'fe-mobile' );
            this.iconRef.nativeElement.classList.remove( 'fe-mobile' );
            this.titleSpanRef.nativeElement.classList.remove( 'fe-mobile' );
            this.contentWrapperRef.nativeElement.classList.remove( 'fe-mobile' );
            this.contentRef.nativeElement.classList.remove( 'fe-mobile' );
        }

        if ( value === 'desktop' ) {
            this.containerRef.nativeElement.classList.add( 'fe-desktop' );
            this.titleBarRef.nativeElement.classList.add( 'fe-desktop' );
            this.iconRef.nativeElement.classList.add( 'fe-desktop' );
            this.titleSpanRef.nativeElement.classList.add( 'fe-desktop' );
            this.contentWrapperRef.nativeElement.classList.add( 'fe-desktop' );
            this.contentRef.nativeElement.classList.add( 'fe-desktop' );
        } else {
            this.containerRef.nativeElement.classList.remove( 'fe-desktop' );
            this.titleBarRef.nativeElement.classList.remove( 'fe-desktop' );
            this.iconRef.nativeElement.classList.remove( 'fe-desktop' );
            this.titleSpanRef.nativeElement.classList.remove( 'fe-desktop' );
            this.contentWrapperRef.nativeElement.classList.remove( 'fe-desktop' );
            this.contentRef.nativeElement.classList.remove( 'fe-desktop' );
        }
    }

    /* Any other values than 'fe-open' or 'fe-close' get redirected to onTransmit method when creating a popup through the service */
    public popupObserver: Subject<'fe-init' | 'fe-open' | 'fe-close' | any> = new Subject();

    @ViewChild( 'container' )
    public containerRef!: ElementRef<HTMLElement>;

    @ViewChild( 'titleBar' )
    public titleBarRef!: ElementRef<HTMLElement>;

    @ViewChild( 'icon' )
    public iconRef!: ElementRef<HTMLElement>;

    @ViewChild( 'titleSpan' )
    public titleSpanRef!: ElementRef<HTMLElement>;

    @ViewChild( 'contentWrapper' )
    public contentWrapperRef!: ElementRef<HTMLElement>;

    @ViewChild( 'content' )
    public contentRef!: ElementRef<HTMLElement>;

    @ViewChild( 'contentTemplate', { read: ViewContainerRef, static: false } )
    public viewContainer!: ViewContainerRef;

    private visibility!: 'visible' | 'hidden';

    private focusTrap!: focusTrap.FocusTrap;

    public ngOnInit(): void {
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

    public trackTitle( index: number, item: string ): string {
        return item;
    }

    public prepareDestroy(): void {
        this.titleAnimationEnabled = false;
    }
}
