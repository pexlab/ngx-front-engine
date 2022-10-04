import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
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

    constructor( private factory: ComponentFactoryResolver, private ngZone: NgZone ) { }

    public createPopupRef(
        options: {
            title: string | Observable<string>,
            component: Type<any>,
            reflect?: Record<string, any>,
            size?: {
                minWidth?: string,
                width?: string,
                maxWidth?: string,
                minHeight?: string,
                height?: string,
                maxHeight?: string
            },
            fixedKind?: 'mobile' | 'desktop',
            exitButton?: boolean
        }
    ): {
        open(): void,
        close(): void,
        onTransmit( observer: ( value: any ) => void ): void,
        onClose( observer: () => void ): void
    } {

        const subject = new Subject<any>();

        const subscriptions: Subscription[] = [];

        const onOpen = new Promise<ComponentRef<PopupComponent>>( async ( resolve ) => {

            await this.ngZone.run( async () => {

                await this.hideAllPopups();

                const wrapperRef = this.root.view.createComponent(
                    this.factory.resolveComponentFactory( PopupComponent )
                );

                if ( typeof options.title === 'string' ) {
                    wrapperRef.instance.title = options.title;
                } else {
                    subscriptions.push(
                        options.title.subscribe( title => wrapperRef.instance.title = title )
                    );
                }

                if ( options.exitButton !== undefined ) {
                    wrapperRef.instance.hideExitIcon = !options.exitButton;
                }

                subscriptions.push(
                    wrapperRef.instance.popupObserver.subscribe( ( value ) => {

                        if ( value === 'fe-init' ) {

                            resolve( wrapperRef );

                        } else if ( value === 'fe-open' ) {

                            subject.next( 'fe-opened' );

                        } else if ( value === 'fe-close' ) {

                            subject.next( 'fe-closing' );

                            this.closePopup( wrapperRef ).then( () => {

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

                this.activatePopup( wrapperRef );

                subject.next( 'fe-opening' );
            } );
        } );

        return {

            onClose: ( observer: () => void ) => {
                subscriptions.push(
                    subject.subscribe( ( value ) => {
                        if ( value === 'fe-closed' ) {
                            observer();
                        }
                    } )
                );
            },

            onTransmit: ( observer: ( value: any ) => void ) => {
                subscriptions.push( subject.subscribe( observer ) );
            },

            close: async () => {
                ( await onOpen ).instance.popupObserver.next( 'fe-close' );
            },

            open: async () => {

                const wrapperRef = await onOpen;

                const injectedComponentRef = wrapperRef.instance.viewContainer.createComponent( options.component );

                wrapperRef.instance.injectedComponentRef = injectedComponentRef;

                if ( options.reflect !== undefined ) {
                    Object.entries( options.reflect ).forEach( ( entry ) => {
                        Reflect.set( injectedComponentRef.instance, entry[ 0 ], entry[ 1 ] );
                    } );
                }

                wrapperRef.instance.width = {
                    minWidth: options.size?.minWidth,
                    width   : options.size?.width,
                    maxWidth: options.size?.maxWidth
                };

                wrapperRef.instance.height = {
                    minHeight: options.size?.minHeight,
                    height   : options.size?.height,
                    maxHeight: options.size?.maxHeight
                };

                if ( options.fixedKind !== undefined ) {
                    wrapperRef.instance.kind = options.fixedKind;
                }

                /* Pass down / transmit events to the main (parent) popup popup-wrapper component */
                ( ( injectedComponentRef.instance as any ).popupObserverTransmitter as Subject<any> ).subscribe( ( value ) => {
                    wrapperRef.instance.popupObserver.next( value );
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

    private closePopup( wrapperRef: ComponentRef<PopupComponent> ): Promise<void> {

        return new Promise<void>( resolve => {

            wrapperRef.instance.setVisibility( 'hidden' );
            wrapperRef.instance.prepareDestroy();
            this.deactivatePopup( wrapperRef );

            setTimeout( () => {

                if ( wrapperRef.instance.injectedComponentRef !== undefined ) {
                    wrapperRef.instance.injectedComponentRef.destroy();
                }

                wrapperRef.destroy();

                /* Re-open the previously displayed popup */
                if ( this.activePopups.length > 0 ) {
                    this.activePopups[ this.activePopups.length - 1 ].instance.setVisibility( 'visible' );
                }

                resolve();

            }, this.hideAnimationDuration );
        } );
    }
}
