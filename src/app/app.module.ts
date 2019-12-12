import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { NgxSelectModule } from 'ngx-select-ex';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MessagesModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
// import { InViewportModule, InViewportService } from 'ng-in-viewport';
// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';
// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SerivceModule } from 'app/services/service.module';

import { AccountListComponent } from 'app/views/account-list';
import { DashboardComponent } from 'app/views/dashboard/dashboard.component';

import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ChartModule } from 'angular2-highcharts';

import { LoginComponent } from './views/auth/login/login.component';
import { AuthComponent } from './views/auth/auth.component';

declare var require: any;
export function highchartsFactory() {
  return require('highcharts');
}
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ChartModule, // for highchart
    SerivceModule,
    FormsModule,
    NgxSelectModule,
    NgxDnDModule,
    ModalModule.forRoot(),
    HttpModule,
    HttpClientModule,
    MessagesModule,
    GrowlModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,

    AccountListComponent,
    DashboardComponent,

    LoginComponent,
    AuthComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  {
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  },
    // InViewportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
