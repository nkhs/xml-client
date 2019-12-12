import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        let user: any = JSON.parse(localStorage.getItem("currentUser"));
        if (user != null && user.isAdmin == true) {
            console.log('Yes');
            return true;
        }

        // this.router.navigate(['/']);
        return false;
    }
}
