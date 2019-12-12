import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/services/api.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { User } from './model/user';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService) { }
  login(user: User): Observable<any> {
    return this.apiService.post('/account/login/', user);
  }
  
  getAccountList(): Observable<any> {
    return this.apiService.get('/account/');
  }
  
  deleteAccount(user: User) {
    return this.apiService.delete(`/account/${user._id}`);
  }
  addAccount(user: User) {
    return this.apiService.put('/account/', user);
  }
  updateAccount(user: User) {
    return this.apiService.post('/account/update/', user);
  }

}
