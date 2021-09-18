import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ThemeService } from './theme/theme.service';

@NgModule(
    {
        
        declarations: [],
        
        imports: [
            AngularSvgIconModule.forRoot(),
        ],
        
        exports: [],
    
        providers: [
            {
                provide: HIGHLIGHT_OPTIONS,
                useValue: {
                    fullLibraryLoader: () => import('highlight.js'),
                }
            }
        ],
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
        
        iconReg.loadSvg( 'assets/fe-icons/caret-up-solid.svg', 'fe-caret-up' );
        iconReg.loadSvg( 'assets/fe-icons/caret-down-solid.svg', 'fe-caret-down' );
        iconReg.loadSvg( 'assets/fe-icons/delete.svg', 'fe-backspace' );
        iconReg.loadSvg( 'assets/fe-icons/x.svg', 'fe-close' );
    }
}
