import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
})
export class AddPurchaseOrderComponent {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  isLoading: boolean = false;
  errorText: string = '';
  userData: { [key: string]: any } = {
    name: "Unknown User"
  }
  fetchedData: { [key: string]: any } = {};

  ngOnInit() {
    // Update the page title
    this.titleService.setTitle(`${APP_NAME}`);

    // check for user authentication
    const xAuth = localStorage.getItem('x-auth');

    if (!xAuth) {
      // this.router.navigate(['/login']);
    }

    console.log(this.router.url);
    if (this.router.url !== "add-purchase-order") {
      this.route.paramMap.subscribe((params) => {
        let id = params.get('id');

        console.log(id);

        if (id) {
          this.getData(id);
        }
      });
    }
  }

  async getData(id: string) {
    this.isLoading = true;

    try {
      const result = await networkRequest.send(`${BACKEND_URL}/Purchase/${id}`, "GET");

      console.log(result);

      if (!result) {
        this.openSnackBar(`Data not found with id: ${id}`, 'Close');
        this.isLoading = false;
        this.router.navigate([`**`]);
        return;
      }

      this.fetchedData = result;

      this.addContentForm.patchValue({       
        supplierId: result.supplierId,
        productId: result.productId,
        purchaseQty: result.purchaseQty,
      })
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.openSnackBar(`Unable to load data with id: ${id}`, 'Close');
    }
  }

  // form add suplier
  supplierId: any = new FormControl('', [Validators.required]);
  productId: any = new FormControl('', [Validators.required]);
  purchaseQty: any = new FormControl('', [Validators.required]);

  addContentForm: any = new FormGroup({
    supplierId: this.supplierId,
    productId: this.productId,
    purchaseQty: this.purchaseQty,
  });

  formBuilder: any = {
    supplierId: {
      label: 'Supplier Id',
      type: 'text',
      id: 'supplierId',
      name: 'supplierId',
      formControlName: 'supplierId',
      error: '',
    },
    productId: {
      label: 'Product Id',
      type: 'text',
      id: 'productId',
      name: 'productId',

      formControlName: 'productId',
      error: '',
    },
    purchaseQty: {
      label: 'Purchase Qty',
      type: 'text',
      id: 'purchaseQty',
      name: 'purchaseQty',
      formControlName: 'purchaseQty',
      error: '',
    },
  };

  formBuilderArray: any[] = Object.values(this.formBuilder);

  async onSubmit() {
    this.getAllFormErrors();

    if (this.addContentForm.valid) {
      // Submit the login form
      const payload = {
        SupplierId: this.addContentForm.value.supplierId,
        ProductId: this.addContentForm.value.productId,
        PurchaseQty: this.addContentForm.value.purchaseQty,
      };

      const queryString = new URLSearchParams(payload).toString();

      this.isLoading = true;

      try {
        let url, method;
        if (this.router.url === "add-purchase-order") {
          url = `${BACKEND_URL}/Purchase/Addpurchase?${queryString}`;
          method = "POST"
        } else {
          const id = this.fetchedData['supplierId'];
          url = `${BACKEND_URL}/Purchase/${id}?${queryString}`;
          method = "PUT"
        }

        const result = await networkRequest.send(url, method);;
        console.log(result);
        if (!result) {
          this.openSnackBar(`data submitted successfully!`, 'Close');
          this.isLoading = false;
        }

        this.isLoading = false;
        this.openSnackBar(`Data added`, 'Close');
      } catch (error: any) {
        console.log(error);
        this.openSnackBar(`${error.message}`, 'Close');
        this.isLoading = false;
      }
    }
  }

  // Method to get all errors of the form
  getAllFormErrors() {
    const keys = Object.keys(this.formBuilder);

    for (let item of keys) {
      const controlErrors = this.addContentForm.get(item).errors;

      this.formBuilder[item].error = "";

      if (!controlErrors) {
        continue;
      }

      if (controlErrors && typeof controlErrors === "object" && controlErrors.hasOwnProperty('required')) {
        this.formBuilder[item].error = `${this.formBuilder[item].label} is required!`;
        return;
      } else if (controlErrors.hasOwnProperty('email')) {
        this.formBuilder[item].error = `${this.formBuilder[item].label} is invalid!`;
        return;
      } else if (controlErrors.hasOwnProperty('pattern')) {
        if (this.formBuilder[item].label == "Phone") {
          this.formBuilder[item].error = "Invalid phone number, It must be 10 digits long only."
          return;
        }

        this.formBuilder[item].error = `${this.formBuilder[item].label} is invalid!`;
        return;
      } else {

      }
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
