import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BannerCarouselService, BannerCarouselState, FeColorPalette } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './banner-carousel.component.html',
        styleUrls  : [ './banner-carousel.component.scss' ]
    }
)
export class BannerCarouselComponent implements OnInit, OnDestroy {
    
    constructor( private bannerCarousel: BannerCarouselService, private ngZone: NgZone ) {
        this.initialBannerCarouselState();
    }
    
    public bannerCarouselInterval?: number;
    
    public ngOnInit(): void {
    }
    
    public ngOnDestroy(): void {
        clearInterval( this.bannerCarouselInterval );
    }
    
    public initialBannerCarouselState(): void {
        
        this.bannerCarousel.rotate( 'rich-showcase', {
            heading   : 'Rich Animated Banner-Carousel',
            subheading: 'Great for advertising purposes',
            buttons   : null,
            theme     : {
                palette           : {},
                complimentaryImage: null
            }
        } );
        
        this.bannerCarousel.rotate( 'reduced-showcase', {
            heading   : 'Reduced Banner-Carousel',
            subheading: 'Great for mobile usage like a title bar',
            buttons   : [
                {
                    text   : 'Back',
                    icon   : 'left',
                    onClick: () => {}
                },
                {
                    text   : 'Action',
                    onClick: () => {}
                }
            ],
            theme     : {
                palette           : {},
                complimentaryImage: null
            }
        } );
    }
    
    public toggleRichShowcase(): void {
        
        if ( this.bannerCarouselInterval ) {
            clearInterval( this.bannerCarouselInterval );
            this.bannerCarouselInterval = undefined;
            this.initialBannerCarouselState();
            return;
        }
        
        let bannerCycleIndex = 0;
        
        const cycleStates = () => {
            
            this.bannerCarousel.rotate( 'rich-showcase', this.richBannerCycles[ bannerCycleIndex ] );
            
            bannerCycleIndex++;
            
            if ( bannerCycleIndex > ( this.richBannerCycles.length - 1 ) ) {
                bannerCycleIndex = 0;
            }
        };
        
        cycleStates();
        this.bannerCarouselInterval = setInterval( () => cycleStates(), 2500 * 2 );
    }
    
    private richBannerCycles: BannerCarouselState[] = [
        {
            heading   : 'Turkish snacks',
            subheading: 'Limited discount only until tomorrow!',
            theme     : {
                palette           : {
                    richAppearance: {
                        background           : FeColorPalette.Red.Berry,
                        buttonIdleBackground : FeColorPalette.Red.Berry,
                        buttonHoverBackground: FeColorPalette.Red.DarkBlood
                    }
                },
                complimentaryImage: {
                    url      : 'assets/images/carousel1.png',
                    alignment: 'top',
                    scale    : 1.5
                }
            },
            buttons   : [
                {
                    text   : 'Explore the Shop',
                    icon   : 'shop',
                    onClick: () => {}
                },
                {
                    text   : 'Surprise Packages',
                    icon   : 'gem',
                    onClick: () => {}
                }
            ]
        },
        {
            heading   : 'Grab some for your friends as well!',
            subheading: 'They\'ll surly love our vast variety of flavors',
            theme     : {
                palette           : {
                    richAppearance: {
                        background           : FeColorPalette.Red.Berry,
                        buttonIdleBackground : FeColorPalette.Red.Berry,
                        buttonHoverBackground: FeColorPalette.Red.DarkBlood
                    }
                },
                complimentaryImage: {
                    url      : 'assets/images/carousel2.png',
                    alignment: 'top',
                    scale    : 1.5
                }
            },
            buttons   : [
                {
                    text   : 'Explore the Shop',
                    icon   : 'shop',
                    onClick: () => {}
                },
                {
                    text   : 'Surprise Packages',
                    icon   : 'gem',
                    onClick: () => {}
                }
            ]
        },
        {
            heading   : 'Worldwide shipping',
            subheading: 'Enjoy free worldwide shipping starting with orders above 25€',
            theme     : {
                palette           : {
                    richAppearance: {
                        background           : FeColorPalette.Red.Berry,
                        buttonIdleBackground : FeColorPalette.Red.Berry,
                        buttonHoverBackground: FeColorPalette.Red.DarkBlood
                    }
                },
                complimentaryImage: {
                    url      : 'assets/images/carousel3.png',
                    alignment: 'top',
                    scale    : 1.5
                }
            },
            buttons   : null
        }
    ];
}
