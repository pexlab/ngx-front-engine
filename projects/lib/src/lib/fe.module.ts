import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { ThemeService } from './theme/theme.service';

@NgModule(
    {
        
        declarations: [],
        
        imports: [
            AngularSvgIconModule.forRoot()
        ],
        
        exports: [],
        
        providers: []
    }
)

export class FeModule {
    
    static forRoot(): ModuleWithProviders<FeModule> {
        return {
            ngModule: FeModule
        };
    }
    
    constructor(
        theme: ThemeService,
        iconReg: SvgIconRegistryService
    ) {
        
        theme.applyCommonTheme();
        theme.applyComponentThemes();
        
        iconReg.loadSvg( 'assets/fe-icons/alert-triangle.svg', 'fe-warning' );
        iconReg.loadSvg( 'assets/fe-icons/caret-down-solid.svg', 'fe-caret-down' );
        iconReg.loadSvg( 'assets/fe-icons/caret-up-solid.svg', 'fe-caret-up' );
        iconReg.loadSvg( 'assets/fe-icons/check.svg', 'fe-success' );
        iconReg.loadSvg( 'assets/fe-icons/delete.svg', 'fe-backspace' );
        iconReg.loadSvg( 'assets/fe-icons/info.svg', 'fe-generic' );
        iconReg.loadSvg( 'assets/fe-icons/info.svg', 'fe-info' );
        iconReg.loadSvg( 'assets/fe-icons/verified-badge.svg', 'fe-verified-badge' );
        iconReg.loadSvg( 'assets/fe-icons/x.svg', 'fe-close' );
        iconReg.loadSvg( 'assets/fe-icons/x-octagon.svg', 'fe-error' );
    }
}
