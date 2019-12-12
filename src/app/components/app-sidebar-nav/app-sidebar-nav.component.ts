import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'app/services';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './app-sidebar-nav.component.html'
})
export class AppSidebarNavComponent implements OnInit {
  ngOnInit(): void {
    this.isAdmin = this.shareService.getUser().isAdmin == true;
  }

  isAdmin = false;
  public isDivider(item) {
    return item.divider ? true : false
  }

  public isTitle(item) {
    return item.title ? true : false
  }

  constructor(private router: Router, private shareService: SharedService) { }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }
}

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li  class='nav-item'>
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    `
})
export class AppSidebarNavItemComponent {
  @Input() item: any;

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false)
  }

  constructor(private router: Router) { }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `

  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;


  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if (this.title.class) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
