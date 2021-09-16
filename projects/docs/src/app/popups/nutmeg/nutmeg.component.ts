import { AfterViewInit, Component } from '@angular/core';
import { ButtonTheme, ComponentTheme, FeColorPalette, FePopup } from '@pexlab/ngx-front-engine';

@FePopup()
@Component(
    {
        templateUrl: './nutmeg.component.html',
        styleUrls  : [ './nutmeg.component.scss' ]
    }
)
export class NutmegComponent implements AfterViewInit {
    
    constructor() { }
    
    public close!: () => void;
    public transmitToHost!: ( value: any ) => void;
    
    public buttonTheme: ComponentTheme<ButtonTheme> = {
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
