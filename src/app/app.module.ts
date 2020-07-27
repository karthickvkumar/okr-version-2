import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { CommonService } from '../app/core-services/common.service';
import { ApiService } from '../app/core-services/api.service';

import { AuthModule } from './feature-modules/auth/auth.module';
import { ProjectModule } from './feature-modules/project/project.module';
import { PageNotFoundComponent } from './core-components/page-not-found/page-not-found.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    AuthModule,
    ProjectModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, CommonService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
