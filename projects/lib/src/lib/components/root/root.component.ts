import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Color } from '../../theme/color';
import { ThemeService } from '../../theme/theme.service';
import { PopupService } from '../popup/popup.service';

@Component(
    {
        selector   : 'fe-root',
        templateUrl: './root.component.html',
        styleUrls  : [ './root.component.scss' ]
    }
)
export class RootComponent implements AfterViewInit, OnDestroy {

    constructor(
        private theme: ThemeService,
        private popupService: PopupService,
        private renderer: Renderer2,
        private ngZone: NgZone,
        public hostElement: ElementRef<HTMLElement>,
        private meta: Meta
    ) {
        this.theme.root        = this;
        this.popupService.root = this;
    }

    private disposeListeners: ( () => void )[] = [];
    private dimmed                             = false;

    @ViewChild( 'popupView', { read: ViewContainerRef } )
    public view!: ViewContainerRef;

    @ViewChild( 'popup' )
    private popupRef!: ElementRef<HTMLDivElement>;

    @ViewChild( 'blurrer' )
    private blurrerRef!: ElementRef<HTMLDivElement>;

    @ViewChild( 'dimmer' )
    private dimmerRef!: ElementRef<HTMLDivElement>;

    @ViewChild( 'scrollBarWrapper' )
    private scrollbarWrapperRef!: ElementRef<HTMLElement>;

    @ViewChild( 'scrollbar' )
    private scrollbarRef!: ElementRef<HTMLElement>;

    public ngAfterViewInit(): void {

        this.hostElement.nativeElement.style.width  = window.innerWidth + 'px';
        this.hostElement.nativeElement.style.height = ( window.innerHeight + 2 ) + 'px';

        this.ngZone.runOutsideAngular( () => {

            this.disposeListeners.push(
                this.renderer.listen( window, 'resize', () => {
                    this.hostElement.nativeElement.style.width  = window.innerWidth + 'px';
                    this.hostElement.nativeElement.style.height = ( window.innerHeight + 2 ) + 'px';
                } )
            );

            document.documentElement.addEventListener( 'touchmove', this.validateEvent, { passive: false } );
        } );

        this.clear();

        this.renderer.setStyle(
            document.documentElement,
            '--scrollbar-width',
            this.getScrollbarWidth() + 'px',
            2
        );
    }

    public ngOnDestroy(): void {
        this.disposeListeners.forEach( ( dispose ) => dispose() );
        document.documentElement.removeEventListener( 'touchmove', this.validateEvent );
    }

    public dim(): void {

        this.renderer.setStyle( this.hostElement.nativeElement, 'pointer-events', 'visible' );
        this.renderer.setStyle( this.hostElement.nativeElement, 'touch-action', 'auto' );

        this.renderer.setStyle( this.blurrerRef.nativeElement, 'backdrop-filter', 'blur(4px)' );
        this.renderer.setStyle( this.blurrerRef.nativeElement, '-webkit-backdrop-filter', 'blur(4px)' );
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'opacity', '1' );

        this.renderer.setStyle( document.documentElement, 'pointer-events', 'none' );
        this.renderer.setStyle( document.documentElement, 'touch-action', 'none' );

        this.renderer.setStyle( document.body, 'overscroll-behavior', 'none' );
        this.renderer.setStyle( document.body, 'pointer-events', 'none' );
        this.renderer.setStyle( document.body, 'touch-action', 'none' );

        this.meta.updateTag( { content: Color.shadeHex( this.theme.common.palette.accent.tab_bar, -.7 ) }, 'name=theme-color' );

        this.dimmed = true;
    }

    public clear(): void {

        this.renderer.removeStyle( this.hostElement.nativeElement, 'pointer-events' );
        this.renderer.removeStyle( this.hostElement.nativeElement, 'touch-action' );

        this.renderer.removeStyle( this.blurrerRef.nativeElement, 'backdrop-filter' );
        this.renderer.removeStyle( this.blurrerRef.nativeElement, '-webkit-backdrop-filter' );
        this.renderer.removeStyle( this.dimmerRef.nativeElement, 'opacity' );

        this.renderer.removeStyle( document.documentElement, 'pointer-events' );
        this.renderer.removeStyle( document.documentElement, 'touch-action' );

        this.renderer.removeStyle( document.body, 'overscroll-behavior' );
        this.renderer.removeStyle( document.body, 'pointer-events' );
        this.renderer.removeStyle( document.body, 'touch-action' );

        this.meta.updateTag( { content: this.theme.common.palette.accent.tab_bar }, 'name=theme-color' );

        this.dimmed = false;
    }

    public getScrollbarWidth(): number {
        return this.scrollbarWrapperRef.nativeElement.offsetWidth - this.scrollbarRef.nativeElement.offsetWidth;
    }

    private validateEvent = ( event: PointerEvent | MouseEvent | TouchEvent ) => {

        if ( !this.dimmed ) {
            return;
        }

        if ( this.popupService.activePopups.length === 0 ) {
            return;
        }

        const activePopup = this.popupService.activePopups[ this.popupService.activePopups.length - 1 ]?.instance;

        if ( !activePopup ) {
            return;
        }

        if ( !activePopup.contentWrapperRef.nativeElement.contains( event.target as HTMLElement ) ) {
            event.preventDefault();
            return;
        }

        if ( activePopup.contentWrapperRef.nativeElement.scrollHeight === activePopup.contentWrapperRef.nativeElement.clientHeight ) {
            event.preventDefault();
            return;
        }
    };
}
