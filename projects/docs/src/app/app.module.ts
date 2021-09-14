import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    BannerCarouselModule,
    FeButtonModule,
    FeCheckboxModule,
    FeDropdownModule,
    FeModule,
    FeStepperModule,
    FeTactileModule,
    FeTextFieldModule
} from '@pexlab/ngx-front-engine';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextFieldComponent } from './pages/components/text-field/text-field.component';
import { ComponentsSidebarComponent } from './pages/components/sidebar/components-sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ButtonComponent } from './pages/components/button/button.component';
import { DropdownComponent } from './pages/components/dropdown/dropdown.component';
import { FormComponent } from './pages/examples/form/form.component';
import { FormSidebarComponent } from './pages/examples/sidebar/form-sidebar.component';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { BannerCarouselComponent } from './pages/components/banner-carousel/banner-carousel.component';
import { StepperComponent } from './pages/components/stepper/stepper.component';

@NgModule(
    {
        
        declarations: [
            AppComponent,
            TextFieldComponent,
            ComponentsSidebarComponent,
            NotFoundComponent,
            ButtonComponent,
            DropdownComponent,
            FormComponent,
            FormSidebarComponent,
            ColorPaletteComponent,
            BannerCarouselComponent,
            StepperComponent
        ],
    
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            FeModule,
            FeButtonModule,
            FeTactileModule,
            FeTextFieldModule,
            FeDropdownModule,
            FeCheckboxModule,
            HttpClientModule,
            AngularSvgIconModule.forRoot(),
            ReactiveFormsModule,
            FeStepperModule,
            BannerCarouselModule
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
