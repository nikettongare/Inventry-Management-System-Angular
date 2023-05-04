import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, NAV_ITEMS } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-metaview',
  templateUrl: './metaview.component.html',
})
export class MetaviewComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }


  viewName: string | null = '';
  isLoading: boolean = false;
  isLoadingBar: boolean = false;
  AppName: string = APP_NAME;
  NavItems: any[] = NAV_ITEMS;
  openUserDropdown: boolean = false;
  CurrentRoute: string = this.router.url;

  // Temp remove later
  UsersName: string = 'Bakasur IceCreamWala';
  data: any[] = [
    {
      supplier_name: 'Bakasur Chanawala',
      phone: 8237914567,
      email: 'chanawala@gmail.com',
      address: 'Street U',
      city: 'New York',
      state: 'Japan',
      country: 'Moon',
    },
    {
      supplier_name: 'Bakasur Chanawala',
      phone: 8237914567,
      email: 'chanawala@gmail.com',
      address: 'Street U',
      city: 'New York',
      state: 'Japan',
      country: 'Moon',
    },
    {
      supplier_name: 'Bakasur Chanawala',
      phone: 8237914567,
      email: 'chanawala@gmail.com',
      address: 'Street U',
      city: 'New York',
      state: 'Japan',
      country: 'Moon',
    },
    {
      supplier_name: 'Bakasur Chanawala',
      phone: 8237914567,
      email: 'chanawala@gmail.com',
      address: 'Street U',
      city: 'New York',
      state: 'Japan',
      country: 'Moon',
    },
    {
      supplier_name: 'Bakasur Chanawala',
      phone: 8237914567,
      email: 'chanawala@gmail.com',
      address: 'Street U',
      city: 'New York',
      state: 'Japan',
      country: 'Moon',
    },
  ];

  valuesData: any[] = this.data.length ? this.data.map((item) => Object.values(item)) : [];
  keysList: any[] = this.data.length ? Object.keys(this.data[0]) : [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.viewName = params.get('name');

      if (!this.viewName) {
        this.router.navigate(['**']);
      }

      // check for user authentication
      const xAuth = localStorage.getItem('x-auth');

      if (!xAuth) {
        // UsersName = JSON.parse(xAuth).name;
        console.log('User Already logged In.', typeof xAuth);
        // this.router.navigate(['/login']);
      }

      this.getData(name!);

      // Update the page title
      this.titleService.setTitle(`${APP_NAME} | Dashboard`);

      // Update the meta tags
      this.metaService.updateTag({
        name: 'description',
        content: `Please Login into the ${APP_NAME}`,
      });
      this.metaService.updateTag({
        name: 'keywords',
        content: `${APP_NAME}, login, signin`,
      });
    });
  }

  async getData(name: string) {
    try {
      const result = await networkRequest.getViewData(name);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  deleteRow(index: number) {
    console.log(this.data[index]);
    let dialogRef = this.dialog.open(DialogComponent, {
      data: this.data[index],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result) {
        return;
      }
      this.isLoadingBar = true;
      // perform delete request here
      this.data.splice(index, 1);
      this.valuesData = this.data.map((item) => Object.values(item));
      this.keysList = Object.keys(this.data[0]);

      this.isLoadingBar = false;
      this.openSnackBar(`Data Deleted Successfully!`, 'Close');
    });

    console.log(this.data);
  }



  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  toggleUserDropDown() {
    this.openUserDropdown = !this.openUserDropdown;
    console.log(this.openUserDropdown);
    
  }
}
