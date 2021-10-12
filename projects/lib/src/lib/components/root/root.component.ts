import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ThemeService } from '../../theme/theme.service';
import { PopupService } from '../popup/popup.service';

@Component(
    {
        selector   : 'fe-root',
        templateUrl: './root.component.html',
        styleUrls  : [ './root.component.scss' ]
    }
)
export class RootComponent implements AfterViewInit {
    
    constructor(
        private theme: ThemeService,
        private popupService: PopupService,
        private renderer: Renderer2
    ) {
        this.theme.root        = this;
        this.popupService.root = this;
    }
    
    @ViewChild( 'popupView', { read: ViewContainerRef } )
    public view!: ViewContainerRef;
    
    @ViewChild( 'dimmer' )
    private dimmerRef!: ElementRef<HTMLDivElement>;
    
    @ViewChild( 'scrollBarWrapper' )
    private scrollbarWrapperRef!: ElementRef<HTMLElement>;
    
    @ViewChild( 'scrollbar' )
    private scrollbarRef!: ElementRef<HTMLElement>;
    
    public ngAfterViewInit(): void {
        
        this.clear();
        
        this.renderer.setStyle(
            document.documentElement,
            '--scrollbar-width',
            this.getScrollbarWidth() + 'px',
            2
        );
    }
    
    public dim(): void {
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'opacity', '0.9' );
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'pointer-events', 'visible' );
    }
    
    public clear(): void {
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'opacity', '0' );
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'pointer-events', 'none' );
    }
    
    public getScrollbarWidth(): number {
        return this.scrollbarWrapperRef.nativeElement.offsetWidth - this.scrollbarRef.nativeElement.offsetWidth;
    }
}
