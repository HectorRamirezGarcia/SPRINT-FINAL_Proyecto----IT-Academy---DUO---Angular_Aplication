import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RegisterComponent } from './register.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
    { path: '', component: LayoutComponent,
        children: [
            { path: 'register', component: RegisterComponent }, 
            { path: 'settings', component: AccountComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }