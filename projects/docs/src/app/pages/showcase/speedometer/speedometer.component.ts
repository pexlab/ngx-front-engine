import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color, ComponentTheme, FeColorPalette, SpeedometerTheme, ThemeService } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './speedometer.component.html',
        styleUrls  : [ './speedometer.component.scss' ]
    }
)
export class SpeedometerComponent implements OnInit, OnDestroy {

    constructor( private theme: ThemeService ) { }

    public speedometerValue            = 0;
    public speedometerMarker: number[] = [];
    private interval!: number;

    private speedometerNormalTheme: SpeedometerTheme = this.theme.component.speedometer;

    private speedometerRedTheme: SpeedometerTheme = {

        hud: FeColorPalette.Greyscale.SnowWhite,

        border: {
            inner: Color.fadeHex( FeColorPalette.Orange.Papaya, .5 ),
            outer: FeColorPalette.Red.Berry
        },

        indicator: {
            gradientStart: FeColorPalette.Red.DarkBlood,
            gradientEnd  : FeColorPalette.Red.Berry
        },

        step: {
            primary  : FeColorPalette.Orange.Papaya,
            secondary: Color.fadeHex( FeColorPalette.Orange.Papaya, .5 )
        },

        marker: {
            fill        : Color.fadeHex( FeColorPalette.Orange.Papaya , .3 ),
            stroke      : FeColorPalette.Orange.Papaya ,
            intermediate: Color.fadeHex( FeColorPalette.Orange.Papaya , .5 )
        },

        text: {
            inner     : FeColorPalette.Greyscale.SnowWhite,
            outer     : FeColorPalette.Greyscale.SnowWhite,
            outerShade: '#171b27',
            hud       : '#171b27'
        },

        background: {
            inner: FeColorPalette.Red.NobleRed,
            outer: '#380000'
        }
    };

    public determineTheme( value: number ): ComponentTheme<SpeedometerTheme> {
        if ( value > 180 ) {
            return {
                palette: this.speedometerRedTheme
            };
        } else {
            return {
                palette: this.speedometerNormalTheme
            };
        }
    }

    public ngOnInit(): void {

        this.interval = setInterval( () => {

            this.setRandomValue();
            this.setRandomMarker();

        }, 2000 );

        this.setRandomValue();
        this.setRandomMarker();
    }

    private setRandomValue() {

        const min = 0;
        const max = 250;

        this.speedometerValue = Math.floor( Math.random() * ( max - min + 1 ) + min );
    }

    private setRandomMarker() {

        const min = 0;
        const max = 250;

        this.speedometerMarker = [
            Math.floor( Math.random() * ( max - min + 1 ) + min ),
            Math.floor( Math.random() * ( max - min + 1 ) + min ),
            Math.floor( Math.random() * ( max - min + 1 ) + min )
        ].sort( ( a, b ) => a - b );
    }

    public ngOnDestroy(): void {
        clearInterval( this.interval );
    }
}
