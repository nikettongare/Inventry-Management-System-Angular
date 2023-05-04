import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
})
export class PurchaseViewComponent {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  viewName: String = 'Purchase Order';
  isLoading: boolean = false;
  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: 'Unknown User',
  };

  fetchedData: any[] = [
    {
      "purchaseId": 11,
      "supplierId": 1,
      "productId": 18,
      "purchaseQty": 0,
      "purchaseDate": "2023-04-27T16:50:53.637",
      "updatedOn": "2023-04-27T16:50:53.637",
      "isDeleted": false
    },
    {
      "purchaseId": 12,
      "supplierId": 1,
      "productId": 18,
      "purchaseQty": 10,
      "purchaseDate": "2023-05-03T22:33:39.347",
      "updatedOn": "2023-05-03T22:33:39.347",
      "isDeleted": false
    },
    {
      "purchaseId": 13,
      "supplierId": 1,
      "productId": 18,
      "purchaseQty": 1,
      "purchaseDate": "2023-05-03T22:55:06.223",
      "updatedOn": "2023-05-03T22:55:06.223",
      "isDeleted": false
    }
  ];

  data: any[] = this.fetchedData.map((item: any) => {
    const { purchaseId, productId, supplierId, purchaseQty, purchaseDate, updatedOn } = item;
    return { purchaseId, productId, supplierId, purchaseQty, purchaseDate, updatedOn } ;
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
      const result = await networkRequest.send(`${BACKEND_URL}/PurchaseOrder`, "GET");
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

        const objId = this.fetchedData[index]["purchaseId"];

        const result = await networkRequest.send(`${BACKEND_URL}/PurchaseOrder/${objId}`, "DELETE");
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
    const objId = this.fetchedData[index]["purchaseId"];
    this.router.navigate([`/edit-purchase-order/${objId}`]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
