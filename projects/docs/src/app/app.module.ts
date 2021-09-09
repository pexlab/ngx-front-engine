import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeButtonModule, FeCheckboxModule, FeDropdownModule, FeModule, FeTactileModule, FeTextFieldModule } from '@pexlab/ngx-front-engine';
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
            FormSidebarComponent
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
            ReactiveFormsModule
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
