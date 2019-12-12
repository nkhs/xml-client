import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, User, SharedService } from '../../services/index';
import { Subject } from 'rxjs/Subject';

import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'page_account_list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})

export class AccountListComponent implements OnInit, OnDestroy {
  @ViewChild('rejectModal') deleteModal;
  @ViewChild('editModal') editModal;
  @ViewChild('addModal') addModal;

  patientsName: Array<string>;
  Data: Array<any> = [];
  DataForDisplay: Array<any> = [];


  busy = false;
  searchUser = '';
  sortUpUser = false;

  onTapSortUser() {
    this.sortUpUser = !this.sortUpUser;
    this._sortUser();
  }

  message = 'No account';
  noData = false;

  isGatewayFilter = false;
  isUserFilter = false;
  constructor(private userService: UserService,
    private sharedService: SharedService,
    private router: Router,
    public meta: Meta,
    public title: Title) {

    title.setTitle('XML Edit - Account List');

  }
  ngOnInit(): void {
    // this.DataForDisplay = this.sharedService.getDataList();
    this.getUserList();
  }


  ngOnDestroy() {
    // this.sharedService.setDataList(this.DataForDisplay);

  }

  _sortUser() {
    this.DataForDisplay.sort((a: any, b: any) => {
      if (this.sortUpUser) {
        if (a.email > b.email) { return 1; }
        if (a.email === b.email) { return 0; }
        if (a.email < b.email) { return -1; }
      } else {
        if (a.email > b.email) { return -1; }
        if (a.email === b.email) { return 0; }
        if (a.email < b.email) { return 1; }
      }
    });
  }

  transform(data: any): any {
    const dataset = data;
    // dataset.time = this.datetimeToTime(new Date(dataset.start));
    return dataset;
  }

  getUserList(): void {

    this.Data = [];
    this.busy = true;
    this.userService.getAccountList()
      .subscribe(res => {
        this.busy = false;
        console.log(res)
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

  tapDateFilter() {

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
        var email = dataset.email;

        if (email == null) { return; }
        if (email.toLocaleLowerCase().includes(this.searchUser.toLocaleLowerCase())) {
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

  selectedAccountForDelete: User;
  selectedAccountForEdit: User;

  deleteDataset($event, dataset) {
    this.selectedAccountForDelete = dataset;
    this.deleteModal.show();
    $event.stopPropagation();
    console.log(dataset);
  }

  editDataset($event, dataset) {
    this.selectedAccountForEdit = dataset;
    this.editUserEmail = this.selectedAccountForEdit.email;
    // this.editUserPassword = this.selectedAccountForEdit.password;

    this.editModal.show();
    $event.stopPropagation();
    console.log(dataset);
  }

  confirmDelete() {
    var self = this;
    this.userService.deleteAccount(this.selectedAccountForDelete)
      .subscribe(res => {
        console.log(res);
        self.getUserList();
      });
  }

  newUserEmail = '';
  newUserPassword = '';
  newUserMessage = '';
  isNewUserBusy = false;
  confirmNewUser() {
    // addModal.hide()
    if (this.newUserEmail.length == 0) {
      this.newUserMessage = 'Please Input email';
      return;
    }
    if (this.newUserPassword.length == 0) {
      this.newUserMessage = 'Please Input password';
      return;
    }
    this.isNewUserBusy = true;
    var user = new User();
    user.email = this.newUserEmail;
    user.password = this.newUserPassword;

    this.userService.addAccount(user).subscribe(res => {
      this.isNewUserBusy = false;
      if (res.success) {
        this.newUserMessage = 'Successfully added new user.';
        this.getUserList();
        this.newUserEmail = '';
        this.newUserPassword = '';

      } else {
        this.newUserMessage = res.message;
      }
    });
  }

  editUserEmail = '';
  editUserPassword = '';
  editUserMessage = '';
  isEditUserBusy = false;

  confirmEditUser() {
    if (this.selectedAccountForEdit == null) return;

    if (this.editUserEmail.length == 0) {
      this.editUserMessage = 'Please Input email';
      return;
    }
    if (this.editUserPassword.length == 0) {
      this.editUserMessage = 'Please Input password';
      return;
    }
    this.isEditUserBusy = true;

    this.selectedAccountForEdit.email = this.editUserEmail;
    this.selectedAccountForEdit.password = this.editUserPassword;

    this.userService.updateAccount(this.selectedAccountForEdit).subscribe(res => {
      this.isEditUserBusy = false;
      if (res.success) {
        this.editUserMessage = 'Successfully updated user.';
        this.getUserList();
        this.editUserEmail = '';
        this.editUserPassword = '';
        this.editModal.hide();

      } else {
        this.editUserMessage = res.message;
      }
    });
  }
}
