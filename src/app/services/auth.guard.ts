import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        var user: any = localStorage.getItem('currentUser');
        if (user == null) {
            // logged in so return true
            this.router.navigate(['/auth']);
            return false;
        }
        user = JSON.parse(user);
        if (user._id == null || user._id.length == 0) {
            this.router.navigate(['/auth']);
            return false;
        }

        // not logged in so redirect to login page
        // this.router.navigate(['/auth']);
        return true;
    }
}
