import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ThemeService } from '@pexlab/ngx-front-engine';
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

        this.iconReg.loadSvg( 'assets/icons/chevron-left.svg', 'left' );
        this.iconReg.loadSvg( 'assets/icons/comments-solid.svg', 'comment' );
        this.iconReg.loadSvg( 'assets/icons/gem-solid.svg', 'gem' );
        this.iconReg.loadSvg( 'assets/icons/heart-solid.svg', 'heart' );
        this.iconReg.loadSvg( 'assets/icons/help-circle.svg', 'help' );
        this.iconReg.loadSvg( 'assets/icons/moon-solid.svg', 'moon' );
        this.iconReg.loadSvg( 'assets/icons/play-circle.svg', 'start' );
        this.iconReg.loadSvg( 'assets/icons/plus.svg', 'add' );
        this.iconReg.loadSvg( 'assets/icons/retweet-solid.svg', 'repost' );
        this.iconReg.loadSvg( 'assets/icons/shopping-cart-solid.svg', 'shop' );
        this.iconReg.loadSvg( 'assets/icons/stop-circle.svg', 'stop' );
        this.iconReg.loadSvg( 'assets/icons/sun-solid.svg', 'sun' );
        this.iconReg.loadSvg( 'assets/icons/type.svg', 'text' );

        this.theme.applyComponentThemes(
            {
                notepaper: {
                    backgroundHoles: '#eeeeee'
                }
            }
        );
    }

    public ngOnInit(): void {
    }

    public ngAfterViewChecked(): void {
        console.log( '(' + this.viewCounter + ') View Checked' );
        this.viewCounter++;
    }
}
