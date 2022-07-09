import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color, ComponentTheme, FeColorPalette, SpeedometerTheme } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './speedometer.component.html',
        styleUrls  : [ './speedometer.component.scss' ]
    }
)
export class SpeedometerComponent implements OnInit, OnDestroy {

    constructor() { }

    public speedometerValue = 0;
    private interval!: number;

    private speedometerNormalTheme: SpeedometerTheme = {
        hud: FeColorPalette.Greyscale.SnowWhite,

        border: {
            inner: FeColorPalette.Greyscale.SnowWhite,
            outer: FeColorPalette.Cyan.AgalAquamarine
        },

        indicator: {
            gradientStart: FeColorPalette.Blue.VividCatalinaBlue,
            gradientEnd  : FeColorPalette.Cyan.AgalAquamarine
        },

        step: {
            primary  : Color.fadeHex( FeColorPalette.Cyan.AgalAquamarine, .5 ),
            secondary: Color.fadeHex( FeColorPalette.Cyan.AgalAquamarine, .5 )
        },

        marker: FeColorPalette.Cyan.AgalAquamarine,

        background: {
            inner: FeColorPalette.Blue.PureBlue,
            outer: FeColorPalette.Blue.Eclipse
        }
    };

    private speedometerRedTheme: SpeedometerTheme = {

        hud: FeColorPalette.Greyscale.SnowWhite,

        border: {
            inner: FeColorPalette.Greyscale.SnowWhite,
            outer: FeColorPalette.Red.Berry
        },

        indicator: {
            gradientStart: FeColorPalette.Red.DarkBlood,
            gradientEnd  : FeColorPalette.Red.Berry
        },

        step: {
            primary  : FeColorPalette.Cyan.AgalAquamarine,
            secondary: FeColorPalette.Cyan.AgalAquamarine
        },

        marker: FeColorPalette.Cyan.AgalAquamarine,

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

        /*this.interval = setInterval( () => {
         this.setRandom();
         }, 500 );*/

        this.setRandom();
    }

    private setRandom() {

        const min = 0;
        const max = 250;

        //this.speedometerValue = Math.floor( Math.random() * ( max - min + 1 ) + min );

        this.speedometerValue = 125;

    }

    public ngOnDestroy(): void {
        clearInterval( this.interval );
    }
}
