import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { z } from 'zod';
import { ComponentTheme, ZHEXColor } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';

@FeComponent( 'popup' )
@Component(
    {
        templateUrl: './popup.component.html',
        styleUrls  : [ './popup.component.scss' ]
    }
)
export class PopupComponent implements OnInit, AfterViewInit {
    
    constructor(
        public hostElement: ElementRef,
        private renderer: Renderer2
    ) {
    }
    
    public feTheme!: ComponentTheme<PartialPopupTheme>;
    
    public hideExitIcon!: boolean;
    public title!: string;
    
    public widthSet = false;
    
    public set width( value: number ) {
        this.widthSet = true;
        this.renderer.setStyle(
            this.hostElement.nativeElement,
            '--popup-width',
            value + 'px',
            2
        );
    }
    
    /* Any other values than 'fe-open' or 'fe-close' get redirected to onTransmit method when creating a popup through the service */
    public popupObserver: Subject<'fe-init' | 'fe-open' | 'fe-close' | any> = new Subject();
    
    @ViewChild( 'content', { read: ViewContainerRef, static: false } )
    public viewContainer!: ViewContainerRef;
    
    private visibility!: 'visible' | 'hidden';
    
    public ngOnInit(): void {
        
        if ( !this.hideExitIcon ) {
            this.hideExitIcon = false;
        }
        
        if ( !this.title ) {
            throw new Error( 'Title hasn\'t been set for popup-component' );
        }
    
        if ( !this.widthSet ) {
            this.width = 400;
        }
        
        this.popupObserver.next( 'fe-init' );
    }
    
    public ngAfterViewInit(): void {
        
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

export const ZPopupTheme = z.object(
    {
        text       : ZHEXColor,
        background : ZHEXColor,
        divider    : ZHEXColor,
        exit       : ZHEXColor,
        outerBorder: ZHEXColor
    }
);

export const ZPartialPopupTheme = ZPopupTheme.partial();

export type PopupTheme = z.infer<typeof ZPopupTheme>;
export type PartialPopupTheme = z.infer<typeof ZPartialPopupTheme>;