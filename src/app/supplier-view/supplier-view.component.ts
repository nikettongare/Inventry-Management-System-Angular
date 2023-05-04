import { Component } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-supplier-view',
  templateUrl: './supplier-view.component.html',
})
export class SupplierViewComponent {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  viewName: String = 'Supplier';
  isLoading: boolean = false;
  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: 'Unknown User',
  };

  fetchedData: any[] = [
    {
      "supplierId": 1,
      "name": "a",
      "phoneNo": "a",
      "emailId": "a",
      "address": "a",
      "postalCode": "a",
      "country": "a",
      "state": "a",
      "city": "a",
      "fax": "a",
      "createdOn": "2023-04-12T05:25:09.477",
      "updatedOn": "2023-04-20T00:06:29.217",
      "isDeleted": false
    },
    {
      "supplierId": 4,
      "name": "string",
      "phoneNo": "string",
      "emailId": "string",
      "address": "string",
      "postalCode": "string",
      "country": "string",
      "state": "string",
      "city": "string",
      "fax": "string",
      "createdOn": "2023-04-14T06:49:26.947",
      "updatedOn": "2023-04-14T06:49:26.947",
      "isDeleted": false
    },
    {
      "supplierId": 10,
      "name": "sdfghj",
      "phoneNo": "111111111111",
      "emailId": "asdfg",
      "address": "sdfgh.",
      "postalCode": "sdfg",
      "country": "asdfg",
      "state": "dfgn",
      "city": "sdg",
      "fax": "123456",
      "createdOn": "2023-04-17T11:58:25.45",
      "updatedOn": "2023-05-03T23:21:02.447",
      "isDeleted": false
    },
    {
      "supplierId": 11,
      "name": "test1",
      "phoneNo": "1111111111",
      "emailId": "ss",
      "address": "qq",
      "postalCode": "11",
      "country": "abc",
      "state": "abcd",
      "city": "abcde",
      "fax": "12357",
      "createdOn": "2023-04-19T19:58:08.603",
      "updatedOn": "2023-04-19T19:58:08.607",
      "isDeleted": false
    },
    {
      "supplierId": 12,
      "name": "jj",
      "phoneNo": "1",
      "emailId": "1",
      "address": "1",
      "postalCode": "1",
      "country": "1",
      "state": "1",
      "city": "1",
      "fax": "1",
      "createdOn": "2023-04-20T00:00:26.457",
      "updatedOn": "2023-04-20T00:00:26.457",
      "isDeleted": false
    },
    {
      "supplierId": 13,
      "name": "asdf",
      "phoneNo": "11111111111",
      "emailId": "asdfgh",
      "address": "asfgh",
      "postalCode": "123456",
      "country": "asdghj",
      "state": "sdfgh",
      "city": "sdfg",
      "fax": "xxxxxxxxxxxx",
      "createdOn": "2023-05-03T23:19:45.747",
      "updatedOn": "2023-05-03T23:19:45.747",
      "isDeleted": false
    }
  ];

  data: any[] = this.fetchedData.map((item: any) => {
    const { name, phoneNo, emailId, address, postalCode, country, state, city } = item;
    return { name, phoneNo, emailId, address, postalCode, country, state, city };
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
    this.titleService.setTitle(`${APP_NAME} | Supplier`);
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
      const result = await networkRequest.send(`${BACKEND_URL}/Supplier`, "GET");
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

        const objId = this.fetchedData[index]["supplierId"];

        const result = await networkRequest.send(`${BACKEND_URL}/Supplier/${objId}`, "DELETE");
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
    const objId = this.fetchedData[index]["supplierId"];
    this.router.navigate([`/edit-supplier/${objId}`]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
