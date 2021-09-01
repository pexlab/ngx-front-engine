import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeButtonModule, FeModule, FeTactileModule, FeTextFieldModule } from '@pexlab/front-engine';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextFieldComponent } from './pages/components/text-field/text-field.component';
import { ComponentsSidebarComponent } from './pages/components/sidebar/components-sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ButtonComponent } from './pages/components/button/button.component';

@NgModule(
    {
        
        declarations: [
            AppComponent,
            TextFieldComponent,
            ComponentsSidebarComponent,
            NotFoundComponent,
            ButtonComponent
        ],
        
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            FeModule,
            FeButtonModule,
            FeTactileModule,
            FeTextFieldModule,
            HttpClientModule,
            AngularSvgIconModule.forRoot()
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
