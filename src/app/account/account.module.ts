import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { RegisterComponent } from './register.component';
import { AccountComponent } from './account.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        AccountRoutingModule,
        FormsModule,
        TranslateModule.forChild({
            extend: true
          })
    ],
    declarations: [
        LayoutComponent,
        RegisterComponent,
        AccountComponent
    ],
    exports: []
})
export class AccountModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}