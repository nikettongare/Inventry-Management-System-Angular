import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
})
export class AddProductComponent {
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
    if (this.router.url !== "add-product") {
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
      const result = await networkRequest.send(`${BACKEND_URL}/Product/${id}`, "GET");

      console.log(result);

      if (!result) {
        this.openSnackBar(`Data not found with id: ${id}`, 'Close');
        this.isLoading = false;
        this.router.navigate([`**`]);
        return;
      }

      this.fetchedData = result;

      this.addContentForm.patchValue({
        productName: result.productName,
        category: result.category,
        code: result.code,
        purchaseRate: result.purchaseRate,
        saleRate: result.saleRate,
        qty: result.qty,
      })
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.openSnackBar(`Unable to load data with id: ${id}`, 'Close');
      this.isLoading = false;
    }
  }

  // form add suplier
  productName: any = new FormControl('', [Validators.required]);
  category: any = new FormControl('', [Validators.required,]);
  code: any = new FormControl('', [Validators.required,]);
  purchaseRate: any = new FormControl('', [Validators.required]);
  saleRate: any = new FormControl('', [Validators.required]);
  qty: any = new FormControl('', [Validators.required]);

  addContentForm: any = new FormGroup({ 
    productName: this.productName,
    category: this.category,
    code: this.code,
    purchaseRate: this.purchaseRate,
    saleRate: this.saleRate,
    qty: this.qty,
  });

  formBuilder: any = {
    productName: {
      label: 'Product Name',
      type: 'text',
      id: 'productName',
      name: 'productName',
      formControlName: 'productName',
      error: '',
    },
    category: {
      label: 'Category',
      type: 'text',
      id: 'category',
      name: 'category',
      formControlName: 'category',
      error: '',
    },
    code: {
      label: 'Code',
      type: 'text',
      id: 'code',
      name: 'code',
      formControlName: 'code',
      error: '',
    },
    purchaseRate: {
      label: 'purchaseRate',
      type: 'text',
      id: 'purchaseRate',
      name: 'purchaseRate',
      formControlName: 'purchaseRate',
      error: '',
    },
    saleRate: {
      label: 'Sale Rate',
      type: 'text',
      id: 'saleRate',
      name: 'saleRate',

      formControlName: 'saleRate',
      error: '',
    },
    qty: {
      label: 'qty',
      type: 'text',
      id: 'qty',
      name: 'qty',

      formControlName: 'qty',
      error: '',
    },   
  };

  formBuilderArray: any[] = Object.values(this.formBuilder);

  async onSubmit() {
    this.getAllFormErrors();

    if (this.addContentForm.valid) {
      // Submit the login form
      const payload = {
        productName: this.addContentForm.value.productName,
        category: this.addContentForm.value.category,
        code: this.addContentForm.value.code,
        purchaseRate: this.addContentForm.value.purchaseRate,
        saleRate: this.addContentForm.value.saleRate,
        qty: this.addContentForm.value.qty,
      };

      const queryString = new URLSearchParams(payload).toString();
      this.isLoading = true;

      try {
        let url, method;
        if (this.router.url === "add-supplier") {
          url = `${BACKEND_URL}/Supplier/register?${queryString}`;
          method = "POST"
        } else {
          const id = this.fetchedData['supplierId'];
          url = `${BACKEND_URL}/Supplier/${id}?${queryString}`;
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
