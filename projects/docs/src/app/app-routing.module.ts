import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { AlertPortalComponent } from './pages/showcase/alert-portal/alert-portal.component';
import { BannerCarouselComponent } from './pages/showcase/banner-carousel/banner-carousel.component';
import { ButtonComponent } from './pages/showcase/button/button.component';
import { DropdownComponent } from './pages/showcase/dropdown/dropdown.component';
import { PopupComponent } from './pages/showcase/popup/popup.component';
import { ShowcaseSidebarComponent } from './pages/showcase/sidebar/showcase-sidebar.component';
import { SpeedometerComponent } from './pages/showcase/speedometer/speedometer.component';
import { StepperComponent } from './pages/showcase/stepper/stepper.component';
import { SwitchComponent } from './pages/showcase/switch/switch.component';
import { TextFieldComponent } from './pages/showcase/text-field/text-field.component';
import { FormComponent } from './pages/examples/form/form.component';
import { FormSidebarComponent } from './pages/examples/sidebar/form-sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule(
    {
        imports: [
            RouterModule.forRoot(
                [
                    {
                        path    : 'showcase',
                        children: [
                            {
                                path     : '',
                                component: ShowcaseSidebarComponent,
                                outlet   : 'sidebar'
                            },
                            {
                                path      : '',
                                redirectTo: '/showcase/text-field',
                                pathMatch : 'full'
                            },
                            {
                                path     : 'text-field',
                                component: TextFieldComponent
                            },
                            {
                                path     : 'dropdown',
                                component: DropdownComponent
                            },
                            {
                                path     : 'button',
                                component: ButtonComponent
                            },
                            {
                                path     : 'banner-carousel',
                                component: BannerCarouselComponent
                            },
                            {
                                path     : 'stepper',
                                component: StepperComponent
                            },
                            {
                                path     : 'switch',
                                component: SwitchComponent
                            },
                            {
                                path     : 'popup',
                                component: PopupComponent
                            },
                            {
                                path     : 'alert-portal',
                                component: AlertPortalComponent
                            },
                            {
                                path     : 'speedometer',
                                component: SpeedometerComponent
                            }
                        ]
                    },
                    {
                        path    : 'examples',
                        children: [
                            {
                                path     : '',
                                component: FormSidebarComponent,
                                outlet   : 'sidebar'
                            },
                            {
                                path      : '',
                                redirectTo: '/examples/form',
                                pathMatch : 'full'
                            },
                            {
                                path     : 'form',
                                component: FormComponent
                            }
                        ]
                    },
                    {
                        path     : 'color-palette',
                        component: ColorPaletteComponent
                    },
                    {
                        path     : '404',
                        component: NotFoundComponent
                    },
                    {
                        path      : '**',
                        redirectTo: '/404'
                    }
                ]
            )
        ],
        exports: [ RouterModule ]
    }
)
export class AppRoutingModule {}
