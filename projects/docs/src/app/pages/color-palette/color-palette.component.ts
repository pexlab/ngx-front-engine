import { Component, OnInit } from '@angular/core';
import { FeColorPalette, ThemeService } from '@pexlab/ngx-front-engine';

@Component(
    {
        templateUrl: './color-palette.component.html',
        styleUrls  : [ './color-palette.component.scss' ]
    }
)

export class ColorPaletteComponent implements OnInit {
    
    constructor( public theme: ThemeService ) { }
    
    public palette: { [ key: string ]: { [ key: string ]: string } } = FeColorPalette;
    
    public getEntries = Object.entries;
    
    public convertName( name: string ) {
        return name.replace( /([A-Z])/g, ' $1' ).trim();
    }
    
    ngOnInit(): void {
    }
}
