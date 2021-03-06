import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { FeComponent } from '../../utils/component.utils';
import { PartialButtonTheme } from '../button/button.theme';
import { BannerCarouselAnimation, BannerCarouselButtonAnimation, BannerCarouselImageAnimation } from './banner-carousel.animation';
import { BannerCarouselButton, BannerCarouselComplimentaryImage, BannerCarouselService } from './banner-carousel.service';
import { PartialBannerCarouselTheme } from './banner-carousel.theme';

@FeComponent( 'bannerCarousel' )
@Component(
    {
        selector       : 'fe-banner-carousel',
        templateUrl    : './banner-carousel.component.html',
        styleUrls      : [ './banner-carousel.component.scss' ],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations     : [
            BannerCarouselAnimation,
            BannerCarouselImageAnimation,
            BannerCarouselButtonAnimation
        ]
    }
)
export class BannerCarouselComponent implements OnInit, AfterViewInit {

    constructor(
        public hostElement: ElementRef,
        private manager: BannerCarouselService,
        private customCdr: ChangeDetectorRef
    ) { }

    public feTheme!: ComponentTheme<PartialBannerCarouselTheme> & {
        complimentaryImage: BannerCarouselComplimentaryImage | null
    };

    private hasBeenInitialised = false;
    private currentInstanceName?: string;

    private stopTrackingCurrentInstance?: () => void;

    /* Must be outputted as an array, therefore this should be kept private and instead a convert function exported */
    private currentHeading?: string | null;
    private currentSubheading?: string | null;

    public buttons?: BannerCarouselButton[] | null;

    /* Use an array with only one value to force angular to destroy and rebuild the element rather then patch the existing element.
     * This behavior is desired to make the in-out-animation work */
    public get text(): { heading: string | null, subheading: string | null }[] {

        if ( this.currentHeading === undefined || this.currentSubheading === undefined ) {
            throw new Error( 'Invalid banner-carousel state' );
        }

        return [
            {
                heading   : this.currentHeading,
                subheading: this.currentSubheading
            }
        ];
    }

    /* Use an array with only one value to force angular to destroy and rebuild the element rather then patch the existing element.
     * This behavior is desired to make the in-out-animation work */
    public get image(): BannerCarouselComplimentaryImage[] | null {

        if ( !this.feTheme || !this.feTheme.complimentaryImage ) {
            return null;
        }

        return [
            {
                url         : this.feTheme.complimentaryImage.url,
                alignment   : this.feTheme.complimentaryImage.alignment,
                scale       : this.feTheme.complimentaryImage.scale,
                marginRight : this.feTheme.complimentaryImage.marginRight,
                marginTop   : this.feTheme.complimentaryImage.marginTop,
                marginBottom: this.feTheme.complimentaryImage.marginBottom
            }
        ];
    }

    public get isInValidState(): boolean {

        return (
            this.currentHeading !== undefined &&
            this.currentSubheading !== undefined &&
            this.buttons !== undefined &&
            this.feTheme !== undefined &&
            this.feTheme.complimentaryImage !== undefined
        );
    }

    @Input()
    public set feInstance( instanceName: string ) {

        if ( this.stopTrackingCurrentInstance ) {
            this.stopTrackingCurrentInstance();
        }

        this.currentInstanceName = instanceName;

        if ( this.hasBeenInitialised ) {
            this.trackInstance( instanceName );
        }
    }

    @Input()
    public feAppearance: 'rich' | 'reduced' = 'rich';

    public ngOnInit(): void {

        this.hasBeenInitialised = true;

        if ( this.currentInstanceName ) {
            this.trackInstance( this.currentInstanceName );
        } else {
            throw new Error( 'No banner-carousel instance name provided' );
        }
    }

    public ngAfterViewInit(): void {
        /* Taking this measure because the svg-icon component dispatched many view checks on initial icon load which causes the arrays of
         the text and images to be re-evaluated which as a result causes the in-out-animation to be played multiple times. */
        this.customCdr.detach();
    }

    public ngOnDestroy(): void {
        if ( this.stopTrackingCurrentInstance ) {
            this.stopTrackingCurrentInstance();
        }
    }

    private trackInstance( instanceName: string ): void {

        try {

            this.stopTrackingCurrentInstance = this.manager.track( instanceName, ( state ) => {

                this.currentHeading    = state.heading;
                this.currentSubheading = state.subheading;
                this.buttons           = state.buttons;
                this.feTheme           = state.theme;

                this.customCdr.detectChanges();
            } );

        } catch ( ex ) {
            throw new Error(
                'The provided banner-carousel instance \'' + instanceName + '\' hasn\'t been initialised yet. ' +
                'Use the banner-carousel-service to rotate to a initial state inside the constructor method.'
            );
        }
    }

    public get buttonTheme(): ComponentTheme<PartialButtonTheme> {

        if ( this.feTheme?.palette?.richAppearance ) {

            return {
                palette: {
                    text      : this.feTheme.palette.richAppearance?.buttonIdleText,
                    background: this.feTheme.palette.richAppearance?.buttonIdleBackground,
                    hinge     : {
                        hoverText      : this.feTheme.palette.richAppearance?.buttonHoverText,
                        hoverBackground: this.feTheme.palette.richAppearance?.buttonHoverBackground
                    }
                }
            };

        } else {

            return {
                palette: {}
            };
        }
    }
}
