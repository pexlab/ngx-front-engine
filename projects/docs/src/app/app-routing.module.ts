import { NgModule } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
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
import { CheckboxComponent } from './pages/showcase/checkbox/checkbox.component';
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
                        component: IntroductionComponent,
                        data     : {
                            metaTitle      : 'Introduction to FrontEngine',
                            metaDescription: 'A angular component library which features astonishing components, theming and a vast color palette'
                        }
                    },
                    {
                        path     : 'getting-started',
                        component: GettingStartedComponent,
                        data     : {
                            metaTitle      : 'Getting started with FrontEngine',
                            metaDescription: 'Installing, customizing and making use of FrontEngine'
                        }
                    },
                    {
                        path    : 'showcase',
                        data    : {
                            metaTitle      : 'Showcase of FrontEngine',
                            metaDescription: 'Learn about the components and features of FrontEngine'
                        },
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
                                path     : 'checkbox',
                                component: CheckboxComponent
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
                        data    : {
                            metaTitle      : 'Examples of FrontEngine in the real world',
                            metaDescription: 'See how FrontEngine could integrate with your existing use-cases'
                        },
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
                        component: ColorPaletteComponent,
                        data     : {
                            metaTitle      : 'Color Palette bundled with FrontEngine',
                            metaDescription: 'Now it is easy the ever to find the right colors with our vast color palette'
                        }
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
export class AppRoutingModule {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.router.events.pipe(
            filter( event => event instanceof NavigationEnd ),
            map( () => this.activatedRoute ),
            map( route => {
                while ( route.firstChild ) {
                    route = route.firstChild;
                }
                return route;
            } ),
            filter( route => route.outlet === 'primary' ),
            mergeMap( route => route.data )
        ).subscribe( ( event ) => {
            this.titleService.setTitle( event[ 'metaTitle' ] );
            this.metaService.removeTag( 'name="description"' );
            this.metaService.addTag( { name: 'description', content: event[ 'metaDescription' ] }, false );
        } );
    }
}
