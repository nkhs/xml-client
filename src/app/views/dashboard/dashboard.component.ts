import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, User, SharedService, AdService, Ad } from '../../services/index';
import { Subject } from 'rxjs/Subject';

declare let $: any;

import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'page_dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('rejectModal') deleteModal;
  @ViewChild('editModal') editModal;
  @ViewChild('addModal') addModal;
  adProviderList = ['Remit2India', 'RemitMoney', 'InstaReM', 'currencyfair', 'Ria Money Transfer', 'ICICI Money2India', 'Indus Fast Remit', 'MoneyDart', 'Pangea', 'Placid Express', 'Remitly', 'Transferwise', 'Venstar Exchange', 'Western Union', 'WorldRemit', 'XOOM', 'InstaRem', 'Kotak Click2Remit', 'Punjab National Bank', 'CitiBank', 'HDFC Quick Remit', 'Remitr']
  patientsName: Array<string>;
  Data: Array<any> = [];
  DataForDisplay: Array<any> = [];
  imageList = []

  busy = false;
  sortUpActivate = false;
  sortUpName = false;
  userId = '';
  userName = '';

  onTapSortName() {
    this.sortUpName = !this.sortUpName;
    this._sortName();
  }
  onTapSortActivate() {
    this.sortUpActivate = !this.sortUpActivate;
    this._sortActivate();
  }

  message = 'No Ad';
  noData = false;

  isGatewayFilter = false;
  isUserFilter = false;
  searchName = '';
  constructor(private userService1: UserService,
    private adService: AdService,
    private sharedService: SharedService,
    private router: Router,
    public meta: Meta,
    public title: Title) {

    title.setTitle('CADS admin panel - Dashboard');

  }
  ngOnInit(): void {
    this.userId = this.sharedService.getUser()._id;
    this.userName = this.sharedService.getUser().email;
    

    // this.DataForDisplay = this.sharedService.getDataList();
    this.getAdList();
    this.getImageList();
  }
  getImageList() {
    this.imageList = [];
    this.adService.getImageList(this.userName)
      .subscribe(res => {
        if (res.success) {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            if (!environment.production) {
              if (data[i] != null && !data[i].includes('http')) {
                this.imageList.push(environment.API_URL + '/' + data[i]);
              }
            }
            else {
              this.imageList.push(data[i]);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.sharedService.setDataList(this.DataForDisplay);

  }

  _sortActivate() {
    this.DataForDisplay.sort((a: any, b: any) => {
      if (this.sortUpActivate) {
        if (a.enable > b.enable) { return 1; }
        if (a.enable === b.enable) { return 0; }
        if (a.enable < b.enable) { return -1; }
      } else {
        if (a.enable > b.enable) { return -1; }
        if (a.enable === b.enable) { return 0; }
        if (a.enable < b.enable) { return 1; }
      }
    });
  }
  _sortName() {
    this.DataForDisplay.sort((a: any, b: any) => {
      if (this.sortUpActivate) {
        if (a.name > b.name) { return 1; }
        if (a.name === b.name) { return 0; }
        if (a.name < b.name) { return -1; }
      } else {
        if (a.name > b.name) { return -1; }
        if (a.name === b.name) { return 0; }
        if (a.name < b.name) { return 1; }
      }
    });
  }

  transform(data: any): any {
    const dataset = data;

    // if (!environment.production) {
    if (data.image != null && !data.image.includes('http')) {
      data.image = environment.API_URL + '/' + data.image;
    }
    // }
    return dataset;
  }

  getAdList(): void {

    this.Data = [];
    this.busy = true;
    this.adService.getAdList(this.userId)
      .subscribe(res => {
        this.busy = false;
        if (res.success) {
          this.Data = [];

          for (const element of res.data) {
            this.Data.push(this.transform(element));
          } // for

          if (this.Data.length === 0) {

            this.DataForDisplay = [];
            this.noData = true;
            return;
          } else {
            this.noData = false;
          }

          this.filterData();
        } else {
          this.noData = true;
          this.DataForDisplay = [];
          console.error(res.message);
        }
      });
  }

  // convert date to Formatted String
  datetimeToTime(date: Date): String {

    const dateTime = new Date(date);

    const hour = dateTime.getHours();
    // const ampm = hour < 12 ? 'AM' : 'PM';
    // hour = hour % 12;
    const hh = (hour / 10 >= 1) ? hour : ('0' + hour);

    const minute = dateTime.getMinutes();
    const min = (minute / 10 >= 1) ? minute : ('0' + minute);
    const second = dateTime.getSeconds();
    const ss = (second / 10 >= 1) ? second : ('0' + second);


    const result: String = `${hh}:${min}`;

    return result;
  }

  AdFilter() {

    this.filterData();
  }

  filterData() {

    if (this.Data === undefined || this.Data === null) { return; }
    if (this.Data.length === 0) { return; }

    this.DataForDisplay = this.__filterWithUsernameText(this.Data);
  }

  __filterWithUsernameText(dataList) {
    // filter with user name text
    if (dataList.length != 0) {
      var dataFilteredUserName = [];
      dataList.forEach((dataset) => {
        var name = dataset.name;

        if (name == null) { return; }
        if (name.toLocaleLowerCase().includes(this.searchName.toLocaleLowerCase())) {
          dataFilteredUserName.push(dataset);
        }
      });
      return dataFilteredUserName;
    }
    return dataList;
    // filter with user name text -- end
  }
  showDetail(item) {
    if (item.datasetId == null) { return; }
    this.sharedService.setSelectedDataSet(item);
    this.router.navigate(['/session', item.datasetId]);
  }

  selectedAccountForDelete: Ad;
  selectedAccountForEdit: Ad;

  deleteDataset($event, dataset) {
    this.selectedAccountForDelete = dataset;
    this.deleteModal.show();
    $event.stopPropagation();
  }

  editDataset($event, dataset) {
    this.selectedAccountForEdit = dataset;
    this.editAdName = this.selectedAccountForEdit.name;
    this.editAdImageURL = this.selectedAccountForEdit.image;
    this.editAdLink = this.selectedAccountForEdit.link;

    this.editAdEnabled = this.selectedAccountForEdit.enable;

    this.editAdType = this.selectedAccountForEdit.type;
    this.editAdBank = this.selectedAccountForEdit.bank;

    this.editAdScheduleType = this.selectedAccountForEdit.scheduleType;
    this.editAdSchedule = this.selectedAccountForEdit.schedule;
    this.editAdImageURL = this.selectedAccountForEdit.image;
    this.editAdMessage = '';
    this.selectedTab = 'upload';
    this.editModal.show();
    $event.stopPropagation();
  }

  confirmDelete() {
    var self = this;
    this.adService.deleteAd(this.selectedAccountForDelete)
      .subscribe(res => {
        console.log(res);
        self.getAdList();
      });
  }

  newAdName = '';
  newAdLink = '';
  newAdOrder = '0';
  newAdOrderIsError = false;
  newAdTagLine = '';
  newAdImageURL = '';
  newAdPosition = '0'
  newAdHeight = '0'
  newAdFullWidth = false;
  newAdEnabled = true;
  newAdType = 'Banner';
  newAdBank = 'Remit2India';
  newAdScheduleType = 'Monthly';
  newAdSchedule = '';

  newAdImageFile: any
  newAdTabId = '0';
  newAdMessage = '';
  isNewUserBusy = false;
  newAdFrequency = '1';
  newAdDuration = '1';

  newAdImageObject: any;
  newImageFileChangeEvent(fileInput: any) {
    const self = this;

    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: any) {
        // $('#preview').attr('src', e.target.result);
        self.newAdImageURL = e.target.result;
        self.newAdImageFile = fileInput.target.files[0];
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  _addNewAd() {

    if (this.newAdType == 'App Link') {
      var orderIsValid = true;
      for (var i = 0; i < this.Data.length; i++) {
        if (this.Data[i].order == parseInt(this.newAdOrder)) orderIsValid = false;
      }
      if (!orderIsValid) {
        this.newAdOrderIsError = true;
        return;
      }
    }

    if ((this.newAdType != 'App Link' && this.newAdType != 'Top Bank' && this.newAdImageURL.length == 0)) {
      this.newAdMessage = 'Please Input image';
      this.isNewUserBusy = false;
      return;
    }
    this.isNewUserBusy = true;
    var ad = new Ad();
    ad.owner = this.userId;

    ad.name = this.newAdName;
    ad.type = this.newAdType;
    ad.bank = this.newAdBank;
    ad.image = this.newAdImageURL;
    ad.enable = this.newAdEnabled;
    ad.link = this.newAdLink;
    ad.scheduleType = this.newAdScheduleType;
    ad.schedule = this.newAdSchedule;
    ad.order = this.newAdOrder;
    ad.tagLine = this.newAdTagLine;
    ad.position = this.newAdPosition;
    ad.height = this.newAdHeight;
    ad.fullwidth = this.newAdFullWidth;
    ad.tabId = this.newAdTabId;
    ad.frequency = this.newAdFrequency;
    ad.duration = this.newAdDuration;

    this.adService.addAd(ad).subscribe(res => {
      this.isNewUserBusy = false;
      if (res.success) {
        this.newAdMessage = 'Successfully added new Ad.';
        setTimeout(() => this.addModal.hide(), 1000);
        this.getAdList();
      } else {
        this.newAdMessage = res.message;
      }
    });
  }

  uploadImage() {

    this.isNewUserBusy = true;
    this.newAdMessage = 'Uploading Image ...';
    this.adService.upload(this.newAdImageFile, this.userName)
      .then(res => {
        console.log(res);

        if (res.success) {
          this.newAdImageURL = res.data;
          this._addNewAd();
        }
      })
      .catch(e => {
        console.error(e);
      })
  }
  onTapNewModal() {
    this.newAdName = '';
    this.newAdType = 'Banner';
    this.newAdLink = ''

    this.newAdImageURL = '';
    this.newAdImageObject = '';

    this.newAdScheduleType = 'Monthly';
    this.newAdSchedule = '';
    this.newAdEnabled = true;
    this.newAdMessage = '';
    this.selectedTab = 'upload'
    this.addModal.show();
  }
  confirmNewAd() {
    if (this.newAdName.length == 0) {
      this.newAdMessage = 'Please Input Ad Name';
      return;
    }
    if (this.newAdSchedule.length == 0) {
      this.newAdMessage = 'Please Input valid schedule';
      return;
    }
    if (this.newScheduleError.length > 0) {
      this.newAdMessage = 'Please Input valid schedule';
      return;
    }
    this.isNewUserBusy = true;
    this.adService.checkAdName(this.newAdName, "").subscribe(res => {
      this.isNewUserBusy = false;

      if (res.success) {
        this.__newAD();
      } else {
        this.newAdMessage = res.message;
      }
    });
  }

  __newAD() {
    if (this.newAdType != 'App Link' && this.newAdImageFile != null) {
      this.uploadImage();
    } else {
      this._addNewAd();
    }
  }

  editAdName = '';
  editAdImageURL = '';
  editAdLink = '';
  editAdMessage = '';
  editAdOrder = '0';
  editAdOrderIsError = false;
  editAdPosition = '0';
  editAdHeight = '0';
  editAdFullWidth = false;
  editAdTagLine = '';
  editAdScheduleType = '';
  editAdSchedule = '';
  editAdTabId = '0';
  editAdEnabled = true;
  isEditUserBusy = false;
  editAdType = '';
  editAdBank = 'Remit2India';
  editAdImageFile: any;
  editAdFrequency = '1';
  editAdDuration = '1';

  editImageFileChangeEvent(fileInput: any) {
    const self = this;

    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: any) {
        // $('#preview').attr('src', e.target.result);
        self.editAdImageURL = e.target.result;
        self.editAdImageFile = fileInput.target.files[0];
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  uploadEditImage() {

    this.isEditUserBusy = true;
    this.editAdMessage = 'Uploading Image ...';
    this.adService.upload(this.editAdImageFile, this.userId)
      .then(res => {
        console.log(res);
        this.isEditUserBusy = false;
        this.editAdImageObject = '';
        if (res.success) {
          this.editAdImageURL = res.data;
          this._editAd();
        }
      })
      .catch(e => {
        console.error(e);
      })
  }
  _editAd() {
    if (this.editAdType == 'App Link') {
      var orderIsValid = true;
      for (var i = 0; i < this.Data.length; i++) {
        if (this.selectedAccountForEdit.order != this.editAdOrder && this.Data[i].order == parseInt(this.editAdOrder)) orderIsValid = false;
      }
      if (!orderIsValid) {
        this.editAdOrderIsError = true;
        return;
      }
    }
    if (this.editAdType != 'App Link' && this.editAdType != 'Top Bank' && this.editAdImageURL.length == 0) {
      this.editAdMessage = 'Please Input Image';
      return;
    }
    this.isEditUserBusy = true;

    this.selectedAccountForEdit.name = this.editAdName;
    this.selectedAccountForEdit.image = this.editAdImageURL;
    this.selectedAccountForEdit.link = this.editAdLink;
    console.log(this.editAdEnabled)
    this.selectedAccountForEdit.enable = this.editAdEnabled;

    this.selectedAccountForEdit.type = this.editAdType;
    this.selectedAccountForEdit.bank = this.editAdBank;

    this.selectedAccountForEdit.scheduleType = this.editAdScheduleType;
    this.selectedAccountForEdit.schedule = this.editAdSchedule;
    this.selectedAccountForEdit.order = this.editAdOrder;
    this.selectedAccountForEdit.tagLine = this.editAdTagLine;
    this.selectedAccountForEdit.position = this.editAdPosition;
    this.selectedAccountForEdit.height = this.editAdHeight;
    this.selectedAccountForEdit.fullwidth = this.editAdFullWidth;
    this.selectedAccountForEdit.tabId = this.editAdTabId;
    this.selectedAccountForEdit.frequency = this.editAdFrequency;
    this.selectedAccountForEdit.duration = this.editAdDuration;

    this.adService.updateAccount(this.selectedAccountForEdit).subscribe(res => {
      this.isEditUserBusy = false;
      if (res.success) {
        this.editAdMessage = 'Successfully updated Ad.';
        setTimeout(() => this.editModal.hide(), 1000);
        this.getAdList();


      } else {
        this.editAdMessage = res.message;
      }
    });
  }
  confirmEditAd() {
    if (this.selectedAccountForEdit == null) return;

    if (this.editAdName.length == 0) {
      this.editAdMessage = 'Please Input Ad Name';
      return;
    }
    if (this.editAdSchedule.length == 0) {
      this.editAdMessage = 'Please Input valid schedule';
      return;
    }
    if (this.editScheduleError.length > 0) {
      this.editAdMessage = 'Please Input valid schedule';
      return;
    }

    this.isEditUserBusy = true;
    this.adService.checkAdName(this.editAdName, this.selectedAccountForEdit._id).subscribe(res => {
      this.isEditUserBusy = false;

      if (res.success) {
        this.__editAD();
      } else {
        this.editAdMessage = res.message;
      }
    });
  }
  editAdImageObject: any;
  __editAD() {
    if (this.editAdType != 'App Link' && this.editAdImageFile != null) {
      this.uploadEditImage();
    } else {
      this._editAd();
    }
  }

  selectedTab = 'upload';
  newScheduleError = '';

  static checkValid_31(schedule) {
    var numberStringList = schedule.split(/[\-,]+/)

    for (var i = 0; i < numberStringList.length; i++) {
      if (numberStringList[i].length == 0) continue;
      try { if (parseInt(numberStringList[i]) > 31) return false; } catch (e) { }
    }
    return true;
  }

  static _checkValid(type, text) {
    if (type == 'Monthly') {
      var r = /^[0-9, \-]*$/gi
      var error = r.test(text)
      if (!error) {
        return false;
      } else {
        if (!this.checkValid_31(text)) return false;
        return true
      }
    }

    if (type == 'Weekly') {
      var r = /^(?!\s*$)(?:sun|mon|tue|wed|thu|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday| |\-|,)+$/gi
      var error = r.test(text)
      if (!error) {
        return false;
      } else {
        return true
      }
    }
  }

  onChangeNewAdSchedule() {
    if (DashboardComponent._checkValid(this.newAdScheduleType, this.newAdSchedule)) {
      this.newScheduleError = ''
    } else {
      this.newScheduleError = 'Invalid Schedule Format'
    }
  }
  editScheduleError = ''
  onChangeEditAdSchedule() {
    if (DashboardComponent._checkValid(this.editAdScheduleType, this.editAdSchedule)) {
      this.editScheduleError = ''
    } else {
      this.editScheduleError = 'Invalid Schedule Format'
    }
  }
  onTapXML() {
    window.open(`${environment.API_URL}/${this.userName}/cads.xml`, '_new');
  }
}
