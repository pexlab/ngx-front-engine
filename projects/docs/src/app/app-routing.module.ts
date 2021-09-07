import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './pages/components/button/button.component';
import { DropdownComponent } from './pages/components/dropdown/dropdown.component';
import { ComponentsSidebarComponent } from './pages/components/sidebar/components-sidebar.component';
import { TextFieldComponent } from './pages/components/text-field/text-field.component';
import { FormComponent } from './pages/examples/form/form.component';
import { FormSidebarComponent } from './pages/examples/sidebar/form-sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule(
    {
        imports: [
            RouterModule.forRoot(
                [
                    {
                        path    : 'components',
                        children: [
                            {
                                path     : '',
                                component: ComponentsSidebarComponent,
                                outlet   : 'sidebar'
                            },
                            {
                                path      : '',
                                redirectTo: '/components/text-field',
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
