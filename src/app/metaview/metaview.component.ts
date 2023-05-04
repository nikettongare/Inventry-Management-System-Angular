import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
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

  viewName: string = '';
  isLoading: boolean = false;
  currentView: { [key: string]: any; } | undefined ;

  isLoadingBar: boolean = false;

  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: "Unknown User"
  }

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
      if (!params.get('name')) {
        this.router.navigate(['**']);
      }

      if (params.get('name') !== null) {
        this.viewName = params.get('name')!;
      }
    
      // check for user authentication
      const xAuth = localStorage.getItem("x-auth");

      if (!xAuth) {
        console.log('User Not Exist Please log In.');
        // this.router.navigate(['/login']);
      }

      if (xAuth) {
        const email = JSON.parse(xAuth).email;
        // this.fetchUsersData(email);
      }

      this.fetchViewDataList();

      // Update the page title
      this.titleService.setTitle(`${APP_NAME} | ${this.viewName}`);
    });
  }

  async fetchUsersData(email: string) {
    try {
      const result = await networkRequest.send(`${BACKEND_URL}/user/${email}`, "GET")
      console.log(result);

      if (!result) {
        this.openSnackBar(`Userdata not found!`, 'Close');
        this.isLoading = false;
        return;
      }

      this.userData = { ...result };
      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message}`, 'Close');
      this.isLoading = false;
    }
  }

  async fetchViewDataList() {
    this.isLoading = true;
    try {
      const result = await networkRequest.send(this.currentView!['list_endpoint'], "GET");



      console.log(result);

      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message}`, 'Close');
      this.isLoading = false;
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
}
