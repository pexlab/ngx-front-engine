import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentTheme } from '../../interfaces/color.interface';
import { PartialBannerCarouselTheme } from './banner-carousel.theme';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class BannerCarouselService {

    constructor() { }

    private instances: {
        [ p: string ]: {
            state: BehaviorSubject<BannerCarouselState>,
            subscriptions: number
        }
    } = {};

    /** If applicable registers a new carousel instance, then proceeds to animate the given instance to the given state. */
    public rotate(
        instanceName: string,
        state: BannerCarouselState
    ): void {

        if ( state.theme.complimentaryImage && state.theme.complimentaryImage.scale ) {
            if ( state.theme.complimentaryImage.scale < 0 || state.theme.complimentaryImage.scale > 2 ) {
                throw new Error( 'The zoom of the banner-carousel\'s complimentary image has to be between 0 and 2' );
            }
        }

        if ( this.instances[ instanceName ] === undefined ) {

            this.register( instanceName, state );

        } else {

            this.instances[ instanceName ].state.next( state );
        }
    }

    public track( instanceName: string, func: ( state: BannerCarouselState ) => void ): () => void {

        const subscription =
                  this.instances[ instanceName ].state.subscribe( ( state ) => {
                      func( state );
                  } );

        this.instances[ instanceName ].subscriptions++;

        return () => {

            subscription.unsubscribe();

            this.instances[ instanceName ].subscriptions--;

            if ( this.instances[ instanceName ].subscriptions <= 0 ) {
                this.unregister( instanceName );
            }
        };
    }

    private register( instanceName: string, initialState: BannerCarouselState ): void {
        this.instances[ instanceName ] = {
            state        : new BehaviorSubject<BannerCarouselState>( initialState ),
            subscriptions: 0
        };
    }

    private unregister( instanceName: string ): void {
        this.instances[ instanceName ].state.complete();
        delete this.instances[ instanceName ];
    }
}

export type BannerCarouselState = {
    heading: string | null,
    subheading: string | null,
    buttons: BannerCarouselButton[] | null
    theme: ComponentTheme<PartialBannerCarouselTheme> & {
        complimentaryImage: BannerCarouselComplimentaryImage | null
    }
};

export type BannerCarouselComplimentaryImage = {
    url: string,
    alignment: 'center' | 'top' | 'bottom'
    scale?: number,
    marginTop?: number
    marginBottom?: number
    marginRight?: number
};

export type BannerCarouselButton = {
    text: string,
    icon?: string,
    link?: string[],
    onClick: () => void;
};
