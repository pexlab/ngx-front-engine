import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
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
    FeSpeedometerModule, CommentModule
} from '@pexlab/ngx-front-engine';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MarkdownModule } from 'ngx-markdown';
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
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { CommentComponent } from './pages/showcase/comment/comment.component';

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
            SpeedometerComponent,
            IntroductionComponent,
            GettingStartedComponent,
            CommentComponent
        ],
    
        imports: [
        
            BrowserModule,
            BrowserAnimationsModule,
        
            HttpClientModule,
            AngularSvgIconModule.forRoot(),
            MarkdownModule.forRoot(
                {
                    loader  : HttpClient,
                    sanitize: SecurityContext.NONE
                }
            ),
            ReactiveFormsModule,
        
            FeModule,
            FeRootModule,
            FeButtonModule,
            FeTactileModule,
            FeTextFieldModule,
            FeDropdownModule,
            FeCheckboxModule,
            FeStepperModule,
            FeBannerCarouselModule,
            FeSwitchModule,
            FeAlertPortalModule,
            FeSpeedometerModule,
        
            AppRoutingModule,
            CommentModule
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
