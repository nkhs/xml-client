import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

// declare var mqtt: any;

@Injectable()
export class IOTService {
  ws: WebSocket;

  iotData = new Subject<iotData>();
  connectionStatus = new Subject<MyConnectionStatus>();
  temperatureHummidity = new Subject<any>();
  iotFirmwareDownloadProgress = new Subject<any>();
  iotBootloaderDownloadProgress = new Subject<any>();
  iotGatewayConnected = new Subject<any>();
  constructor(private apiService: ApiService,
  ) { }

  sendCloudToDeviceMessage(deviceId: string, methodName: string, data: any): Observable<any> {
    return this.apiService.post(`/iot/direct-method-socket/`, {
      deviceId: deviceId,
      methodName: methodName,
      data
    });
  }

  listenMessages() {
    if (this.ws) {
      if (this.ws.readyState == this.ws.OPEN) {
        // this.ws.close();
        return
      }
    }
    console.log('connecting WebSocket: ', environment.SOCKET_URL);
    this.ws = new WebSocket(environment.SOCKET_URL);
    this.ws.onopen = function () {
      console.log('Successfully connect WebSocket');
    }
    this.ws.onmessage = (message) => {
      try {
        const obj = JSON.parse(message.data);

        if (obj.TAG === 'TEST') {
          return;
        }
        
        console.error(obj.data);
      } catch (err) {
        console.error(err);
      }
    };

    const self = this;
    this.ws.onclose = (msg) => {
      try {
        console.log('Web Socket closed');
        console.log('Try Reconnecting ...');

        self.listenMessages();
      } catch (err) {
        console.error(err);
      }
    };
  }

  dataListener() {
    return this.iotData.asObservable();
  }
  firmwareDownloadListener() {
    return this.iotFirmwareDownloadProgress.asObservable();
  }
  bootloaderDownloadListener() {
    return this.iotBootloaderDownloadProgress.asObservable();
  }
  deviceConnectionStatusChangeListner() {
    return this.connectionStatus.asObservable();
  }
  temperatureHummidityChangeListner() {
    return this.temperatureHummidity.asObservable();
  }
  gatewayStartListner() {
    return this.iotGatewayConnected.asObservable();
  }
}

export class iotData {
  emitter_mac: string;
  emitter_gateway: string;
  ecg: number[];
  isSensor: boolean;
  heartrate: number[];
  battery: number;
  temperature: number;
  duration: number;
  posture: number;
  rssi: number;
};
export class MyConnectionStatus {
  mac: string;
  isConnected: boolean;
}