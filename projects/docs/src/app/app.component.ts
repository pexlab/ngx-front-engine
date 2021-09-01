import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ThemeService } from '@pexlab/front-engine';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Component(
    {
        selector   : 'app-root',
        templateUrl: './app.component.html',
        styleUrls  : [ './app.component.scss' ]
    }
)

export class AppComponent implements OnInit, AfterViewChecked {
    
    private viewCounter = 1;
    
    constructor( private iconReg: SvgIconRegistryService, private theme: ThemeService ) {
        this.iconReg.loadSvg( 'assets/logo.svg', 'logo' );
        this.iconReg.loadSvg( 'assets/icons/type.svg', 'text' );
    }
    
    public ngOnInit(): void {
    }
    
    public ngAfterViewChecked(): void {
        console.log( '(' + this.viewCounter + ') View Checked' );
        this.viewCounter++;
    }
}
