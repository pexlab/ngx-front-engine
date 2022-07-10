import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ColorPaletteComponent } from './pages/color-palette/color-palette.component';
import { FormComponent } from './pages/examples/form/form.component';
import { FormSidebarComponent } from './pages/examples/sidebar/form-sidebar.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AlertPortalComponent } from './pages/showcase/alert-portal/alert-portal.component';
import { BannerCarouselComponent } from './pages/showcase/banner-carousel/banner-carousel.component';
import { BookComponent } from './pages/showcase/book/book.component';
import { ButtonComponent } from './pages/showcase/button/button.component';
import { CommentComponent } from './pages/showcase/comment/comment.component';
import { DropdownComponent } from './pages/showcase/dropdown/dropdown.component';
import { NotepaperComponent } from './pages/showcase/notepaper/notepaper.component';
import { PopupComponent } from './pages/showcase/popup/popup.component';
import { ShowcaseSidebarComponent } from './pages/showcase/sidebar/showcase-sidebar.component';
import { SpeedometerComponent } from './pages/showcase/speedometer/speedometer.component';
import { StepperComponent } from './pages/showcase/stepper/stepper.component';
import { SwitchComponent } from './pages/showcase/switch/switch.component';
import { TableComponent } from './pages/showcase/table/table.component';
import { TextFieldComponent } from './pages/showcase/text-field/text-field.component';

@NgModule(
    {
        imports: [
            RouterModule.forRoot(
                [
                    {
                        path     : 'introduction',
                        component: IntroductionComponent
                    },
                    {
                        path     : 'getting-started',
                        component: GettingStartedComponent
                    },
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
                                path     : 'alert-portal',
                                component: AlertPortalComponent
                            },
                            {
                                path     : 'banner-carousel',
                                component: BannerCarouselComponent
                            },
                            {
                                path     : 'book',
                                component: BookComponent
                            },
                            {
                                path     : 'button',
                                component: ButtonComponent
                            },
                            {
                                path     : 'comment',
                                component: CommentComponent
                            },
                            {
                                path     : 'dropdown',
                                component: DropdownComponent
                            },
                            {
                                path     : 'notepaper',
                                component: NotepaperComponent
                            },
                            {
                                path     : 'popup',
                                component: PopupComponent
                            },
                            {
                                path     : 'speedometer',
                                component: SpeedometerComponent
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
                                path     : 'table',
                                component: TableComponent
                            },
                            {
                                path     : 'text-field',
                                component: TextFieldComponent
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
                        redirectTo: '/introduction'
                    }
                ]
            )
        ],
        exports: [ RouterModule ]
    }
)
export class AppRoutingModule {}
