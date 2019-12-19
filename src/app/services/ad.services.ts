import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ApiService } from 'app/services/api.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Ad } from './model/ad';
import { environment } from '../../environments/environment';

@Injectable()
export class AdService {
  constructor(private apiService: ApiService) { }

  getAdList(userId): Observable<any> {
    return this.apiService.get(`/ad/${userId}`);
  }

  deleteAd(ad: Ad) {
    return this.apiService.delete(`/ad/${ad._id}`);
  }

  addAd(ad: Ad) {
    return this.apiService.put('/ad/', ad);
  }

  checkAdName(adName: string, adID: string) {
    return this.apiService.post('/ad/ad-namecheck/', { name: adName, id: adID });
  }

  updateAccount(ad: Ad) {
    return this.apiService.post('/ad/update/', ad);
  }

  upload(file: File, userId): Promise<any> {
    return new Promise((resolve, reject) => {

      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(xhr.response);
            try {
              const json = JSON.parse(xhr.response);
              resolve(json);
            } catch {
              resolve(xhr.response);
            }
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', `${environment.API_URL}/storage/upload/${userId}`, true);

      const formData = new FormData();
      formData.append('file', file, file.name);
      xhr.send(formData);
    });
  }

  getImageList(userId): Observable<any> {
    return this.apiService.get(`/storage/image-list/${userId}`);
  }

}
