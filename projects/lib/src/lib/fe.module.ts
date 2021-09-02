import { ModuleWithProviders, NgModule } from '@angular/core';
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
    }
}
