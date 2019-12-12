import { Injectable } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PerformanceService {
  constructor(private apiService: ApiService) { }

  getLogs(deviceId): Observable<any> {
    return this.apiService.get(`/performance/${deviceId}`);
  }
}
