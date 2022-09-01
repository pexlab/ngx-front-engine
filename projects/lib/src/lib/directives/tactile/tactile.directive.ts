import { animate, AnimationBuilder, AnimationMetadata, style } from '@angular/animations';
import { Location } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Directive(
    {
        selector: '[fe-tactile]'
    }
)

export class TactileDirective implements OnInit, OnDestroy {

    private pointerEvent                       = false;
    private heldDown                           = false;
    private lastHeldDown                       = 0;
    private disposeListeners: ( () => void )[] = [];
    private touchRadiusX                       = 0;
    private touchRadiusY                       = 0;
    private anchorElement?: HTMLAnchorElement;

    constructor(
        private builder: AnimationBuilder,
        private hostElement: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private location: Location,
        private router: Router
    ) {
    }

    public ngOnInit(): void {

        /* The directive does not change any property. It solely plays an animation.
         It is because of that why view checking is not needed. */
        this.ngZone.runOutsideAngular( () => {

            /* To improve SEO discoverability of the link (since it would exist only in javascript otherwise) */
            if ( this.link && typeof this.link === 'string' ) {
                this.anchorElement                     = document.createElement( 'a' );
                this.anchorElement.href                = this.link;
                this.anchorElement.style.position      = 'fixed';
                this.anchorElement.style.opacity       = '0';
                this.anchorElement.style.visibility    = 'hidden';
                this.anchorElement.style.pointerEvents = 'none';
                this.renderer.appendChild( document.body, this.anchorElement );
            }

            this.disposeListeners.push(
                /* Touch Events */

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'touchstart',
                    ( event: TouchEvent ) => {
                        this.pointerEvent = true;
                        this.touchRadiusX = event.touches[ 0 ].radiusX ?? 0;
                        this.touchRadiusY = event.touches[ 0 ].radiusY ?? 0;
                        this.onPointerDown( event, 'touch' );
                    }
                ),

                this.renderer.listen(
                    document.documentElement,
                    'touchcancel',
                    () => {
                        this.pointerEvent = true;
                        if ( this.heldDown ) {
                            this.heldDown = false;
                            this.animateBack();
                        }
                    }
                ),

                this.renderer.listen(
                    document.documentElement,
                    'touchmove',
                    () => {
                        this.pointerEvent = true;
                        if ( this.heldDown && !this.captureTouch ) {
                            this.heldDown = false;
                            this.animateBack();
                        }
                    }
                ),

                /* Pointer Events */

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'pointerdown',
                    event => {
                        this.pointerEvent = true;
                        this.onPointerDown( event, 'pointer' );
                    }
                ),

                this.renderer.listen(
                    document.documentElement,
                    'pointerup',
                    event => {
                        this.pointerEvent = true;
                        this.onPointerUp( event );
                    }
                ),

                /* Keyboard Events */

                this.renderer.listen(
                    document.documentElement,
                    'keydown',
                    event => {
                        this.pointerEvent = false;
                        this.onKeyDown( event );
                    }
                ),

                this.renderer.listen(
                    document.documentElement,
                    'keyup',
                    event => {
                        this.pointerEvent = false;
                        this.onKeyUp( event );
                    }
                ),

                /* Focus Events */

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'focusin',
                    ( event: FocusEvent ) => {

                        /* Disallow focus when it's triggered by a pointer event */
                        if ( event.isTrusted && this.pointerEvent ) {
                            this.hostElement.nativeElement.blur();
                            return;
                        }

                        if ( this.target ) {
                            this.target.classList.add( 'hoverState' );
                        }

                        this.hostElement.nativeElement.classList.add( 'hoverState' );
                    }
                ),

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'focusout',
                    () => {

                        if ( this.heldDown ) {
                            this.heldDown = false;
                            this.animateBack();
                        }

                        if ( this.target ) {
                            this.target.classList.remove( 'hoverState' );
                        }

                        this.hostElement.nativeElement.classList.remove( 'hoverState' );
                    }
                ),

                /* Miscellaneous Events */

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'click',
                    event => this.onClick( event )
                )
            );
        } );
    }

    public ngOnDestroy(): void {
        this.ngZone.runOutsideAngular( () => {

            if ( this.anchorElement ) {
                this.renderer.removeChild( document.body, this.anchorElement );
            }

            this.disposeListeners.forEach( dispose => {
                dispose();
            } );
        } );
    }

    @Input( 'fe-tactile' )
    public target?: HTMLElement = this.hostElement.nativeElement;

    @Input( 'feLink' )
    public link?: string | any[];

    @Input( 'feLinkTarget' )
    public linkTarget: 'auto' | 'same_tab' | 'new_tab' = 'auto';

    @Input( 'feShouldAnimate' )
    public animate = true;

    @Input( 'feViewCheck' )
    public viewCheck: boolean = true;

    @Input( 'feCaptureTouch' )
    public captureTouch: boolean = false;

    @Input( 'feTriggerClickHover' )
    public triggerClickHover: boolean = true;

    @Output( 'feClick' )
    public clickOutput: EventEmitter<any> = new EventEmitter();

    private onClick( event: MouseEvent ): void {

        if ( event.isTrusted ) {

            event.preventDefault();
            event.stopImmediatePropagation();

        } else {
            if ( this.viewCheck ) {
                this.ngZone.run( () => {
                    this.clickOutput.emit();
                } );
            } else {
                this.clickOutput.emit();
            }
        }
    }

    private onPointerDown( event: PointerEvent | TouchEvent, type: 'touch' | 'pointer' ): void {

        if ( this.heldDown ) {
            return;
        }

        if ( event instanceof MouseEvent ) {

            if ( !this.link ) {

                /* Accept only left button on non-links */
                if ( event.button !== 0 ) {
                    return;
                }

            } else {

                /* Ignore right click on links */
                if ( event.button === 3 ) {
                    return;
                }
            }
        }

        /* E.g. when the users touch was meant for scrolling */
        if ( !event.cancelable ) {
            return;
        }

        /* Reject pointerdown events triggered by touch to ensure they come only through the touchstart event */
        if ( ( event as any ).pointerType && ( event as any ).pointerType === 'touch' ) {
            /* Prevent focus by touch */
            event.preventDefault();
            return;
        }

        if ( type === 'pointer' || this.captureTouch ) {
            event.preventDefault();
        }

        this.heldDown     = true;
        this.lastHeldDown = Date.now();

        const metadata: AnimationMetadata[] = [
            animate(
                '150ms cubic-bezier(0, 0.55, 0.45, 1)',
                style( { transform: 'scale(' + this.calculateEffect() + ')' } )
            )
        ];

        if ( this.animate ) {
            const factory = this.builder.build( metadata );
            const player  = factory.create( this.target );
            player.play();
        }

        if ( this.triggerClickHover ) {

            if ( this.target ) {
                this.target.classList.add( 'hoverState' );
            }

            this.hostElement.nativeElement.classList.add( 'hoverState' );
        }
    }

    private onPointerUp( event: PointerEvent ): void {

        if ( !this.heldDown ) {
            return;
        }

        event.preventDefault();

        this.animateBack();

        /* If the mouse is not on the component anymore, ignore the click. Most users behave this way, if they accidentally clicked. */
        if ( this.isOnHostElement( event ) ) {
            this.triggerClick( event );
        }
    }

    private onKeyDown( event: KeyboardEvent ) {

        if ( this.heldDown ) {
            return;
        }

        if ( document.activeElement !== this.hostElement.nativeElement ) {
            return;
        }

        if ( event.key !== 'Enter' && event.key !== ' ' ) {
            return;
        }

        event.preventDefault();

        this.heldDown     = true;
        this.lastHeldDown = Date.now();

        const metadata: AnimationMetadata[] = [
            animate(
                '150ms cubic-bezier(0, 0.55, 0.45, 1)',
                style( { transform: 'scale(' + this.calculateEffect() + ')' } )
            )
        ];

        if ( this.animate ) {
            const factory = this.builder.build( metadata );
            const player  = factory.create( this.target );
            player.play();
        }
    }

    private onKeyUp( event: KeyboardEvent ) {

        if ( !this.heldDown ) {
            return;
        }

        if ( document.activeElement !== this.hostElement.nativeElement ) {
            return;
        }

        if ( event.key !== 'Enter' && event.key !== ' ' ) {
            return;
        }

        event.preventDefault();

        this.animateBack( false );

        this.triggerClick( event );
    }

    private animateBack( removeHoverState: boolean = true ): void {

        const remainingTime = (
                                  Date.now() - this.lastHeldDown
                              ) > 150 ? 0 : 150 - (
            Date.now() - this.lastHeldDown
        );

        setTimeout( () => {

            this.heldDown = false;

            const metadata: AnimationMetadata[] = [
                animate( '200ms ease', style( { transform: 'scale(1)' } ) )
            ];

            if ( this.animate ) {
                const factory = this.builder.build( metadata );
                const player  = factory.create( this.target );
                player.play();
            }

            if ( removeHoverState && this.triggerClickHover && document.activeElement !== this.hostElement.nativeElement ) {

                if ( this.target ) {
                    this.target.classList.remove( 'hoverState' );
                }

                this.hostElement.nativeElement.classList.remove( 'hoverState' );
            }

        }, remainingTime );
    }

    /* Different sizes of components look better with more or less of an effect. */
    private calculateEffect(): number {

        if ( !this.target ) {
            return 1;
        }

        const width  = this.target.offsetWidth;
        const height = this.target.offsetHeight;

        const area = width * height;

        return +Math.max( 1 - (
            (
                100 * 15
            ) / area
        ), 0.85 ).toFixed( 2 );
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

    private triggerClick( event: MouseEvent | PointerEvent | KeyboardEvent ) {

        if ( this.hostElement.nativeElement.click !== undefined ) {
            this.hostElement.nativeElement.click();
        }

        if ( this.link && typeof this.link === 'string' ) {

            const newTab =
                      this.linkTarget === 'auto' ? (
                          event instanceof MouseEvent ?
                          (
                              event.button === 1 ||
                              event.shiftKey ||
                              event.ctrlKey ||
                              event.metaKey ||
                              event.altKey
                          ) : false
                      ) : this.linkTarget === 'new_tab';

            if ( newTab ) {

                window.open( this.link, '_blank' );

            } else {

                if ( this.link.startsWith( 'http' ) || this.link.startsWith( 'https' ) ) {

                    const base = this.location.prepareExternalUrl( '/' );

                    if ( this.link.startsWith( base ) ) {

                        let stripped = this.link.slice( base.length );

                        if ( !stripped.startsWith( '/' ) ) {
                            stripped = '/' + stripped;
                        }

                        if ( this.viewCheck ) {
                            this.ngZone.run( () => {
                                this.router.navigate( [ stripped ] ).then();
                            } );
                        } else {
                            this.router.navigate( [ stripped ] ).then();
                        }

                    } else {
                        window.open( this.link, '_self' );
                    }

                } else {
                    if ( this.viewCheck ) {
                        this.ngZone.run( () => {
                            this.router.navigate( [ this.link ] ).then();
                        } );
                    } else {
                        this.router.navigate( [ this.link ] ).then();
                    }
                }
            }

        } else if ( this.link && typeof this.link !== 'string' ) {

            const link = this.link;

            if ( this.viewCheck ) {
                this.ngZone.run( () => {
                    this.router.navigate( link ).then();
                } );
            } else {
                this.router.navigate( link ).then();
            }
        }
    }
}
