import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, SharedService, User } from '../../../services/index';
import { Meta, Title } from '@angular/platform-browser';
@Component({

  selector: 'my-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  user: User = null;
  onRegister: Boolean = true;
  onEmail: Boolean = true;
  onLogin: Boolean = true;
  errorMessage = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService,

    public meta: Meta,
    public title: Title
  ) {
    title.setTitle('CADS admin panel - Login Page');
    this.user = new User();
  }
  isBusy = false;
  ngOnInit(): void {
  }
  signin(): void {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.onRegister = true;
    if (this.user.email == null || this.user.password == null) {
      this.onRegister = false;
    }
    this.onEmail = true;// re.test(this.user.username);
    if (this.onRegister === true && this.onEmail === true) {
      this.isBusy = true;

      this.userService.login(this.user)
        .subscribe(res => {
          this.isBusy = false;
          if (res.success) {
            const user = new User();
            user._id = res.data._id;
            user.email = res.data.email;
            user.password = res.data.password;
            user.isAdmin = res.data.isAdmin;
            this.gotoMainPage(user);
          } else {
            this.errorMessage = res.message;

            var self = this;
            setTimeout(function () {
              self.errorMessage = '';
            }, 2000);
          }
        });
    }
  }

  gotoMainPage(user: User) {
    this.sharedService.setUser(user);
    if (user.isAdmin) this.router.navigate(['/account-list']);
    else this.router.navigate(['/dashboard']);
  }
}
