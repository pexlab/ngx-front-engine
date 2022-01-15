import { ComponentFactoryResolver, ComponentRef, Injectable, Type } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RootComponent } from '../root/root.component';
import { PopupComponent } from './popup.component';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class PopupService {
    
    public root!: RootComponent;
    
    public readonly hideAnimationDuration = 500;
    
    public activePopups: ComponentRef<PopupComponent> [] = [];
    
    constructor( private factory: ComponentFactoryResolver ) { }
    
    public createPopup( title: string, hideExitIcon?: boolean ): {
        onTransmit( observer: ( value: any ) => void ): void
        close(): void
        open( component: Type<any>, reflect?: { name: string, value: any }[], width?: number ): void
    } {
        
        const subject = new Subject<any>();
        
        const subscriptions: Subscription[] = [];
        
        const onOpen = new Promise<ComponentRef<PopupComponent>>( async ( resolve ) => {
            
            await this.hideAllPopups();
            
            const popup = this.root.view.createComponent(
                this.factory.resolveComponentFactory( PopupComponent )
            );
            
            popup.instance.title = title;
            
            if ( hideExitIcon !== undefined ) {
                popup.instance.hideExitIcon = hideExitIcon;
            }
            
            subscriptions.push(
                popup.instance.popupObserver.subscribe( ( value ) => {
                    
                    if ( value === 'fe-init' ) {
                        
                        resolve( popup );
                        
                    } else if ( value === 'fe-open' ) {
                        
                        subject.next( 'fe-opened' );
                        
                    } else if ( value === 'fe-close' ) {
                        
                        subject.next( 'fe-closing' );
                        
                        this.closePopup( popup ).then( () => {
                            
                            subject.next( 'fe-closed' );
                            subject.complete();
                            
                            subscriptions.forEach( ( sub ) => {
                                sub.unsubscribe();
                            } );
                            
                        } );
                        
                    } else {
                        subject.next( value );
                    }
                    
                } )
            );
            
            this.activatePopup( popup );
            subject.next( 'fe-opening' );
        } );
        
        return {
            
            onTransmit: ( observer: ( value: any ) => void ) => {
                subscriptions.push( subject.subscribe( observer ) );
            },
            
            close: async () => {
                ( await onOpen ).instance.popupObserver.next( 'fe-close' );
            },
            
            open: async ( component, reflect, width ) => {
                
                const parent = await onOpen;
                
                const created = parent.instance.viewContainer.createComponent(
                    this.factory.resolveComponentFactory( component )
                );
                
                if ( reflect !== undefined ) {
                    reflect.forEach( property => {
                        Reflect.set( created.instance, property.name, property.value );
                    } );
                }
                
                if ( width !== undefined ) {
                    parent.instance.width = width;
                }
                
                /* Pass down / transmit events to the main (parent) popup popup-wrapper component */
                ( ( created.instance as any ).popupObserverTransmitter as Subject<any> ).subscribe( ( value ) => {
                    parent.instance.popupObserver.next( value );
                } );
            }
        };
    }
    
    private activatePopup( popup: ComponentRef<PopupComponent> ): void {
        this.activePopups.push( popup );
        this.handleDim();
    }
    
    private deactivatePopup( popup: ComponentRef<PopupComponent> ): void {
        this.activePopups.splice( this.activePopups.indexOf( popup, 0 ), 1 );
        this.handleDim();
    }
    
    private handleDim(): void {
        this.activePopups.length > 0 ? this.root.dim() : this.root.clear();
    }
    
    private async hideAllPopups(): Promise<void> {
        
        const promises: Promise<void>[] = [];
        
        this.activePopups.forEach( ( popup, index ) => {
            
            if ( popup.instance.getVisibility() === 'visible' ) {
                
                promises.push( new Promise( ( r ) => setTimeout(
                    () => {
                        
                        popup.instance.setVisibility( 'hidden' );
                        
                        r();
                        
                    }, this.hideAnimationDuration * ( index + 1 ) ) )
                );
            }
        } );
        
        await Promise.all( promises );
    }
    
    private closePopup( popup: ComponentRef<PopupComponent> ): Promise<void> {
        
        return new Promise<void>( resolve => {
            
            popup.instance.setVisibility( 'hidden' );
            this.deactivatePopup( popup );
            
            setTimeout( () => {
                
                popup.destroy();
                
                /* Re-open the previously displayed popup */
                if ( this.activePopups.length > 0 ) {
                    this.activePopups[ this.activePopups.length - 1 ].instance.setVisibility( 'visible' );
                }
                
                resolve();
                
            }, this.hideAnimationDuration );
        } );
    }
}
