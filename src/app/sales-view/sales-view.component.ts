import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-sales-view',
  templateUrl: './sales-view.component.html',
})
export class SalesViewComponent {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  viewName: String = 'Sales Order';
  isLoading: boolean = false;
  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: 'Unknown User',
  };

  fetchedData: any[] = [
    {
      "salesId": 13,
      "productId": 20,
      "qty": 10,
      "totalAmount": 10,
      "custName": "asdfghjk",
      "saleDate": "2023-05-03T23:05:12.477",
      "updatedOn": "2023-05-03T23:05:12.477",
      "isDeleted": false
    }
  ];

  data: any[] = this.fetchedData.map((item: any) => {
    const { productId, qty, totalAmount, custName, saleDate, updatedOn } = item;
    return { productId, qty, totalAmount, custName, saleDate, updatedOn }  ;
  });

  valuesData: any[] = this.data.length
    ? this.data.map((item) => Object.values(item))
    : [];
  keysList: any[] = this.data.length ? Object.keys(this.data[0]) : [];

  ngOnInit() {
    // check for user authentication
    const xAuth = localStorage.getItem("x-auth");

    if (!xAuth) {
      console.log('User Not Exist Please log In.');
      // this.router.navigate(['/login']);
    }

    if (xAuth) {
      const email = JSON.parse(xAuth).email;
      this.fetchUsersData(email);
      this.fetchViewData();
    }

    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | ${this.viewName}`);
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

  async fetchViewData() {
    this.isLoading = true;

    try {
      const result = await networkRequest.send(`${BACKEND_URL}/SalesOrder`, "GET");
      console.log(result);

      this.fetchedData = result;
      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message || error}`, 'Close');
      this.isLoading = false;
    }
  }

  deleteRow(index: number) {
    console.log(this.data[index]);
    let dialogRef = this.dialog.open(DialogComponent, {
      data: this.data[index],
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result, typeof result);
      if (result === "false") {
        return;
      }
      // perform delete request here
      this.isLoading = true;
      try {

        const objId = this.fetchedData[index]["salesId"];

        const result = await networkRequest.send(`${BACKEND_URL}/SalesOrder/${objId}`, "DELETE");
        console.log(result);

        if (!result) {
          this.openSnackBar(`Unable Delete the data.`, 'Close');
          this.isLoading = false;
          return;
        }

        this.fetchedData.splice(index, 1);
        this.valuesData = this.fetchedData.map((item) => Object.values(item));
        this.keysList = Object.keys(this.fetchedData[0]);
        this.isLoading = false;
        this.openSnackBar(`Data Deleted Successfully!`, 'Close');
      } catch (error: any) {
        console.log(error);
        this.openSnackBar(`${error.message || error}`, 'Close');
        this.isLoading = false;
      }
    });
  }

  editRow(index: number) {
    const objId = this.fetchedData[index]["salesId"];
    this.router.navigate([`/edit-sales-order/${objId}`]);
  }

  searchItem(event: any) {
    const searchText = event.target.value;

    if (!searchText) {
      this.data = this.fetchedData.map((item: any) => {
        const { productId, qty, totalAmount, custName, saleDate, updatedOn }  = item;
        return { productId, qty, totalAmount, custName, saleDate, updatedOn } ;
      });
    }

    let searchedList = this.data.filter(item => Object.values(item).some((value: any) => value.includes(searchText)));

    if (searchedList) {
      this.data = searchedList;
    } else {
      this.data = []
    }
    this.valuesData = this.data.length
      ? this.data.map((item) => Object.values(item))
      : [];
    this.keysList = this.data.length ? Object.keys(this.data[0]) : [];
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
