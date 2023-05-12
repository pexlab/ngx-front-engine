import { AfterViewInit, Component } from '@angular/core';
import { ComponentTheme, FeColorPalette, IFePopup, PartialButtonTheme } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './nutmeg.component.html',
        styleUrls  : [ './nutmeg.component.scss' ]
    }
)
export class NutmegComponent implements AfterViewInit, IFePopup {

    constructor() { }

    public close!: () => void;
    public transmitToHost!: ( value: any ) => void;

    public buttonTheme: ComponentTheme<PartialButtonTheme> = {
        palette: {
            text        : FeColorPalette.Greyscale.SnowWhite,
            background  : FeColorPalette.Brown.CoffeeLatte,
            borderBottom: FeColorPalette.Brown.BrownSugar
        }
    };

    public ngAfterViewInit(): void {
        this.transmitToHost( 'Sample nutmeg transmit data' );
    }
}
