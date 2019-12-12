import { Component } from '@angular/core';

import { SharedService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  constructor(public sharedService: SharedService) {

  }

}
