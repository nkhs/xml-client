import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ApiService } from 'app/services/api.service';

import { IOTService } from 'app/services/iot.service';
import { SharedService } from './shared.services';

import { UserService } from './user.services';
import { AdService } from './ad.services';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

@NgModule({
    imports: [
        HttpModule
    ],
    exports: [],
    declarations: [],
    providers: [
        ApiService,
        IOTService,
        SharedService,
        UserService,
        AdService,
        AuthGuard,
        AdminGuard
    ],
})
export class SerivceModule { }
