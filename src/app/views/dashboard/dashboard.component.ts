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

  patientsName: Array<string>;
  Data: Array<any> = [];
  DataForDisplay: Array<any> = [];
  imageList = ['assets/img/ad_thumb.png', 'assets/img/ad_thumb.png',
    'assets/img/ad_thumb.png', 'assets/img/ad_thumb.png',
    'assets/img/ad_thumb.png', 'assets/img/ad_thumb.png',
    'assets/img/ad_thumb.png', 'assets/img/ad_thumb.png',]

  busy = false;
  sortUpActivate = false;
  sortUpName = false;
  userId = '';

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

    title.setTitle('XML Edit - Dashboard');

  }
  ngOnInit(): void {
    this.userId = this.sharedService.getUser()._id;

    // this.DataForDisplay = this.sharedService.getDataList();
    this.getAdList();
    this.getImageList();
  }
  getImageList() {
    this.imageList = [];
    this.adService.getImageList(this.userId)
      .subscribe(res => {
        if (res.success) {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            if (!environment.production) {
              if (data[i] != null && !data[i].includes('http')) {
                this.imageList.push(environment.SERVER_URL + '/' + data[i]);
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

    if (!environment.production) {
      if (data.image != null && !data.image.includes('http')) {
        data.image = environment.SERVER_URL + '/' + data.image;
      }
    }
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
    this.editModal.show();
    $event.stopPropagation();
    console.log(dataset);
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
  newAdDescription = '';
  newAdImageURL = '';
  newAdEnabled = true;
  newAdType = 'Banner';
  newAdBank = '';
  newAdScheduleType = 'Monthly';
  newAdSchedule = '';

  newAdImageFile: any

  newAdMessage = '';
  isNewUserBusy = false;
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

    if (this.newAdImageURL.length == 0) {
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
    ad.link = this.newAdDescription;
    ad.scheduleType = this.newAdScheduleType;
    ad.schedule = this.newAdSchedule;
    this.adService.addAd(ad).subscribe(res => {
      this.isNewUserBusy = false;
      if (res.success) {
        this.newAdMessage = 'Successfully added new Ad.';
        this.getAdList();
        this.newAdName = '';
        this.newAdImageURL = '';
        this.newAdSchedule = '';
        this.newAdEnabled = true;

      } else {
        this.newAdMessage = res.message;
      }
    });
  }

  uploadImage() {

    this.isNewUserBusy = true;
    this.newAdMessage = 'Uploading Image ...';
    this.adService.upload(this.newAdImageFile, this.userId)
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
  confirmNewAd() {
    if (this.newAdName.length == 0) {
      this.newAdMessage = 'Please Input Ad Name';
      this.isNewUserBusy = false;
      return;
    }

    if (this.newAdImageFile != null) {
      this.uploadImage();
    } else {
      this._addNewAd();
    }
  }

  editAdName = '';
  editAdImageURL = '';
  editAdLink = '';
  editAdMessage = '';

  editAdScheduleType = '';
  editAdSchedule = '';

  editAdEnabled = true;
  isEditUserBusy = false;
  editAdType = '';
  editAdBank = '';
  editAdImageFile: any;

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
    this.adService.upload(this.editAdImageFile,  this.userId)
      .then(res => {
        console.log(res);
        this.isEditUserBusy = false;
        if (res.success) {
          this.editAdImageURL = res.data;
          this._addEditAd();
        }
      })
      .catch(e => {
        console.error(e);
      })
  }
  _addEditAd() {

    if (this.editAdImageURL.length == 0) {
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

    this.adService.updateAccount(this.selectedAccountForEdit).subscribe(res => {
      this.isEditUserBusy = false;
      if (res.success) {
        this.editAdMessage = 'Successfully updated Ad.';
        this.getAdList();
        this.editAdName = '';
        this.editAdImageURL = '';
        this.editAdLink = '';
        this.editAdEnabled = true;
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

    if (this.editAdImageFile != null) {
      this.uploadEditImage();
    } else {
      this._addEditAd();
    }
  }

  selectedTab = 'upload';
}
