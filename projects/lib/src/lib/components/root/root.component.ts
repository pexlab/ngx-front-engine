import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { PopupService } from '../popup/popup.service';

@Component(
    {
        selector   : 'fe-root',
        templateUrl: './root.component.html',
        styleUrls  : [ './root.component.scss' ]
    }
)
export class RootComponent implements AfterViewInit {
    
    constructor( private popupService: PopupService, private renderer: Renderer2 ) {
        this.popupService.root = this;
    }
    
    @ViewChild( 'popupView', { read: ViewContainerRef } )
    public view!: ViewContainerRef;
    
    @ViewChild( 'dimmer' )
    private dimmerRef!: ElementRef<HTMLDivElement>;
    
    public ngAfterViewInit(): void {
        this.clear();
    }
    
    public dim(): void {
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'opacity', '0.9' );
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'pointer-events', 'visible' );
    }
    
    public clear(): void {
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'opacity', '0' );
        this.renderer.setStyle( this.dimmerRef.nativeElement, 'pointer-events', 'none' );
    }
}
