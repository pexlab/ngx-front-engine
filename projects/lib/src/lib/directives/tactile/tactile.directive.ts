import { animate, AnimationBuilder, AnimationMetadata, style } from '@angular/animations';
import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Directive(
    {
        selector: '[fe-tactile]'
    }
)

export class TactileDirective implements OnInit, OnDestroy {
    
    private heldDown                           = false;
    private lastHeldDown                       = 0;
    private disposeListeners: ( () => void )[] = [];
    private mouseOnElement                     = false;
    
    constructor(
        private builder: AnimationBuilder,
        private hostElement: ElementRef,
        private renderer: Renderer2,
        private ngZone: NgZone
    ) {
    }
    
    public ngOnInit(): void {
        /* The directive does not change any property. It solely plays a animation.
         It is because of that why view checking is not needed. */
        this.ngZone.runOutsideAngular( () => {
            
            this.disposeListeners.push(
                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'mousedown',
                    event => this.onMouseDown( event )
                ),
                
                this.renderer.listen(
                    document.documentElement,
                    'mouseup',
                    event => this.onMouseUp( event )
                ),
                
                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'click',
                    event => this.onClick( event )
                ),
                
                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'mouseenter',
                    () => {
                        this.mouseOnElement = true;
                    }
                ),
                
                this.renderer.listen(
                    this.hostElement.nativeElement,
                    'mouseleave',
                    () => {
                        this.mouseOnElement = false;
                    }
                )
            );
        } );
    }
    
    public ngOnDestroy(): void {
        this.ngZone.runOutsideAngular( () => {
            this.disposeListeners.forEach( dispose => {
                dispose();
            } );
        } );
    }
    
    @Input( 'fe-tactile' )
    public target?: HTMLElement = this.hostElement.nativeElement;
    
    @Output()
    public tactileClick: EventEmitter<any> = new EventEmitter();
    
    private onClick( event: MouseEvent ): void {
        
        if ( event.isTrusted ) {
            
            event.preventDefault();
            event.stopImmediatePropagation();
            
        } else {
            
            /* Trigger view checking */
            this.ngZone.run( () => {
                this.tactileClick.emit();
            } );
        }
    }
    
    private onMouseDown( event: MouseEvent ): void {
        
        if ( this.heldDown ) {
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
        
        const factory = this.builder.build( metadata );
        const player  = factory.create( this.target );
        
        player.play();
    }
    
    private onMouseUp( event: MouseEvent ): void {
        
        if ( !this.heldDown ) {
            return;
        }
        
        event.preventDefault();
        
        /* If the mouse is not on the component anymore, ignore the click. Most users behave this way, if they accidentally clicked. */
        if ( this.mouseOnElement ) {
            this.hostElement.nativeElement.click();
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
            
            const factory = this.builder.build( metadata );
            const player  = factory.create( this.target );
            
            player.play();
            
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
}
