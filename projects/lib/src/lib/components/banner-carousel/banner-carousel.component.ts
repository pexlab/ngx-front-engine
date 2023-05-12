import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { ComponentTheme } from '../../interfaces/color.interface';
import { ThemeableFeComponent } from '../../utils/component.utils';
import { PartialButtonTheme } from '../button/button.theme';
import { BannerCarouselAnimation, BannerCarouselButtonAnimation, BannerCarouselImageAnimation } from './banner-carousel.animation';
import { BannerCarouselButton, BannerCarouselComplimentaryImage, BannerCarouselService } from './banner-carousel.service';
import { PartialBannerCarouselTheme } from './banner-carousel.theme';

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
export class BannerCarouselComponent extends ThemeableFeComponent implements OnInit, AfterViewChecked {

    constructor(
        public hostElement: ElementRef,
        private manager: BannerCarouselService,
        public change: ChangeDetectorRef
    ) {
        super();
        this.initializeFeComponent( 'bannerCarousel', this );
    }

    public feTheme: ( ComponentTheme<PartialBannerCarouselTheme> & {
        complimentaryImage: BannerCarouselComplimentaryImage | null
    } ) | undefined;

    private hasBeenInitialised = false;
    private currentInstanceName?: string;

    public lastBannerImage?: BannerCarouselComplimentaryImage;

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

    public trackText( index: number, item: { heading: string | null, subheading: string | null } ): string {
        return item.heading ?? '' + ',' + item.subheading ?? '';
    }

    /* Use an array with only one value to force angular to destroy and rebuild the element rather then patch the existing element.
     * This behavior is desired to make the in-out-animation work */
    public get image(): BannerCarouselComplimentaryImage[] {

        if ( !this.feTheme || !this.feTheme.complimentaryImage ) {
            return [];
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

    public ngOnDestroy(): void {
        if ( this.stopTrackingCurrentInstance ) {
            this.stopTrackingCurrentInstance();
        }
    }

    public ngAfterViewChecked(): void {
        this.lastBannerImage = this.feTheme?.complimentaryImage ?? undefined;
    }

    private trackInstance( instanceName: string ): void {

        try {

            this.stopTrackingCurrentInstance = this.manager.track( instanceName, ( state ) => {

                this.currentHeading    = state.heading;
                this.currentSubheading = state.subheading;
                this.buttons           = state.buttons;
                this.feTheme           = state.theme;

                this.change.detectChanges();
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

    public trackImage( index: number, image: BannerCarouselComplimentaryImage ) {
        return image.url;
    }
}
