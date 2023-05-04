import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAME, BACKEND_URL, NAV_ITEMS } from 'src/config';

@Component({
  selector: 'app-aside-panel',
  templateUrl: './aside-panel.component.html',
})
export class AsidePanelComponent {
  constructor(private router: Router) { }

  AppName: string = APP_NAME;
  NavItems: any[] = NAV_ITEMS;

  CurrentRoute: string = this.router.url;
}
