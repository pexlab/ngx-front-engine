import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FeBannerCarouselModule,
    FeButtonModule,
    FeCheckboxModule,
    FeDropdownModule,
    FeModule, FeRootModule,
    FeStepperModule, FeSwitchModule,
    FeTactileModule,
    FeTextFieldModule,
    FeAlertPortalModule,
    FeSpeedometerModule
} from '@pexlab/ngx-front-engine';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextFieldComponent } from './pages/showcase/text-field/text-field.component';
import { ShowcaseSidebarComponent } from './pages/showcase/sidebar/showcase-sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ButtonComponent } from './pages/showcase/button/button.component';
import { DropdownComponent } from './pages/showcase/dropdown/dropdown.component';
import { FormComponent } from './pages/examples/form/form.component';
import { FormSidebarComponent } from './pages/examples/sidebar/form-sidebar.component';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { BannerCarouselComponent } from './pages/showcase/banner-carousel/banner-carousel.component';
import { StepperComponent } from './pages/showcase/stepper/stepper.component';
import { SwitchComponent } from './pages/showcase/switch/switch.component';
import { PopupComponent } from './pages/showcase/popup/popup.component';
import { NutmegComponent } from './popups/nutmeg/nutmeg.component';
import { AlertPortalComponent } from './pages/showcase/alert-portal/alert-portal.component';
import { SpeedometerComponent } from './pages/showcase/speedometer/speedometer.component';

@NgModule(
    {
        
        declarations: [
            AppComponent,
            TextFieldComponent,
            ShowcaseSidebarComponent,
            NotFoundComponent,
            ButtonComponent,
            DropdownComponent,
            FormComponent,
            FormSidebarComponent,
            ColorPaletteComponent,
            BannerCarouselComponent,
            StepperComponent,
            SwitchComponent,
            PopupComponent,
            NutmegComponent,
            AlertPortalComponent,
            SpeedometerComponent
        ],
    
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            FeModule,
            FeRootModule,
            FeButtonModule,
            FeTactileModule,
            FeTextFieldModule,
            FeDropdownModule,
            FeCheckboxModule,
            HttpClientModule,
            AngularSvgIconModule.forRoot(),
            ReactiveFormsModule,
            FeStepperModule,
            FeBannerCarouselModule,
            FeSwitchModule,
            FeAlertPortalModule,
            FeSpeedometerModule
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
