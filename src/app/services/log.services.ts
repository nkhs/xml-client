import { Injectable } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LogService {
  constructor(private apiService: ApiService) { }

  getLogs(): Observable<any> {
    return this.apiService.get('/errormessage/');
  }
}
