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
                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'touchstart',
                    ( event: TouchEvent ) => {
                        this.touchRadiusX = event.touches[ 0 ].radiusX ?? 0;
                        this.touchRadiusY = event.touches[ 0 ].radiusY ?? 0;
                        this.onPointerDown( event );
                    }
                ),

                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'pointerdown',
                    event => this.onPointerDown( event )
                ),

                this.renderer.listen(
                    document.documentElement,
                    'pointerup',
                    event => this.onPointerUp( event )
                ),

                this.renderer.listen(
                    document.documentElement,
                    'touchcancel',
                    event => this.heldDown = false
                ),

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

    @Output( 'feClick' )
    public clickOutput: EventEmitter<any> = new EventEmitter();

    private onClick( event: MouseEvent ): void {

        if ( event.isTrusted ) {

            event.preventDefault();
            event.stopImmediatePropagation();

        } else {
            this.clickOutput.emit();
        }
    }

    private onPointerDown( event: PointerEvent | TouchEvent ): void {

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

        ( this.target ?? this.hostElement.nativeElement ).classList.add( 'hoverState' );
    }

    private onPointerUp( event: PointerEvent ): void {

        if ( !this.heldDown ) {
            return;
        }

        event.preventDefault();

        /* If the mouse is not on the component anymore, ignore the click. Most users behave this way, if they accidentally clicked. */
        if ( this.isOnHostElement( event ) ) {

            const doClick = () => {

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

                                this.router.navigate( [ stripped ] ).then();

                            } else {
                                window.open( this.link, '_self' );
                            }

                        } else {
                            this.router.navigate( [ this.link ] ).then();
                        }
                    }

                } else if ( this.link && typeof this.link !== 'string' ) {
                    this.router.navigate( this.link ).then();
                }
            };

            if ( this.viewCheck ) {
                this.ngZone.run( doClick );
            } else {
                doClick();
            }
        }

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

            ( this.target ?? this.hostElement.nativeElement ).classList.remove( 'hoverState' );

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
}
