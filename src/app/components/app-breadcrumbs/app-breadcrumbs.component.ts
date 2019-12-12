import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { SharedService } from '../../services';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './app-breadcrumbs.component.html',
  styleUrls: ['./app-breadcrumbs.component.scss']
})
export class AppBreadcrumbsComponent {

  breadcrumbs: Array<Object>;
  zoom = 1;
  isMonitor = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    var self = this;
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
        url = '';
      this.isMonitor = false;
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        // tslint:disable-next-line:no-shadowed-variable

        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            var label = route.snapshot.data.title + '';
            if (label == 'Monitor') {
              self.isMonitor = true;
            }
            this.breadcrumbs.push({
              label: route.snapshot.data,
              url: url
            });
            currentRoute = route;
          }
        });
      } while (currentRoute);
    });
  }

  onTapZoomIn() {
    if (this.zoom >= 2) return;
    this.zoom++;
  }

  onTapZoomOut() {
    if (this.zoom <= -1) return;
    this.zoom--;
  }
}
