import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { User } from "./model/user";
import { IOTService } from "./iot.service";
@Injectable()
export class SharedService {
  ECG_DATA_LIMIT_MAX = 4 * 250;

  constructor(private iotService: IOTService) {
    this.init();
  }
  init() {
  }

  getLang(): string {
    const lange = JSON.parse(localStorage.getItem("_language"));
    return lange;
  }

  setLang(lange: string) {
    localStorage.setItem("_language", JSON.stringify(lange));
  }

  getUser(): User {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser;
  }

  setUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  getCalendarType(): string {
    const type = JSON.parse(localStorage.getItem("calendartype"));
    return type;
  }
  setCalendarType(_type: string) {
    localStorage.setItem("calendartype", JSON.stringify(_type));
  }

  getSelectedDataSet(): any {
    const dataset = JSON.parse(localStorage.getItem("selectedDataSet"));
    return dataset;
  }

  setSelectedDataSet(dataset: any) {
    localStorage.setItem("selectedDataSet", JSON.stringify(dataset));
  }
  arrDatalist = [];
  getDataList(): any {
    return this.arrDatalist;
  }
  setDataList(arrDataset: any) {
    this.arrDatalist = arrDataset;
  }

  isMonthFilter = false;
  isExercise = true;
  isSleep = true;
  
  selectedUser = {};

  setSelectedUser(user) {
    this.selectedUser = user;
  }
  getSelectedUser(): any {
    return this.selectedUser;
  }

  getDataType(): string {
    const type = JSON.parse(localStorage.getItem("datatype"));
    return type;
  }

  setDataType(_type: string) {
    localStorage.setItem("datatype", JSON.stringify(_type));
  }
  
  getSelectedMenu(): string {
    const menu = JSON.parse(localStorage.getItem("selectedMenu"));
    return menu;
  }

  setSelectedMenu(menu: string) {
    localStorage.setItem("selectedMenu", JSON.stringify(menu));
  }
}
