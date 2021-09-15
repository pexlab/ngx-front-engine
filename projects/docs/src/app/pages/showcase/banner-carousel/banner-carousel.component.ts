import { Component, NgZone, OnInit } from '@angular/core';
import { BannerCarouselService, BannerCarouselState } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './banner-carousel.component.html',
        styleUrls  : [ './banner-carousel.component.scss' ]
    }
)
export class BannerCarouselComponent implements OnInit {
    
    constructor( private bannerCarousel: BannerCarouselService, private ngZone: NgZone ) {
        this.initialBannerCarouselState();
    }
    
    private bannerCarouselInterval?: number;
    
    public ngOnInit(): void {
    }
    
    public initialBannerCarouselState(): void {
        this.bannerCarousel.rotate( 'showcase', {
            heading   : 'An Animated Banner-Carousel',
            subheading: 'Click the button below to showcase it\'s functions',
            buttons   : null,
            theme     : {
                palette           : {},
                complimentaryImage: null
            }
        } );
    }
    
    public toggleShowcase(): void {
        
        if ( this.bannerCarouselInterval ) {
            clearInterval( this.bannerCarouselInterval );
            this.bannerCarouselInterval = undefined;
            this.initialBannerCarouselState();
            return;
        }
        
        let bannerCycleIndex = 0;
        
        const cycleStates = () => {
            
            this.bannerCarousel.rotate( 'showcase', this.bannerCycles[ bannerCycleIndex ] );
            
            bannerCycleIndex++;
            
            if ( bannerCycleIndex > ( this.bannerCycles.length - 1 ) ) {
                bannerCycleIndex = 0;
            }
        };
        
        cycleStates();
        this.bannerCarouselInterval = setInterval( () => cycleStates(), 2500 * 2 );
    }
    
    private bannerCycles: BannerCarouselState[] = [
        {
            heading   : 'Turkish snacks',
            subheading: 'Limited discount only until tomorrow!',
            theme     : {
                palette           : {},
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
                palette           : {},
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
                palette           : {},
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
