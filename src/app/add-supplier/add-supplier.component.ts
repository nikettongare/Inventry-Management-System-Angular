import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAME, BACKEND_URL, NAV_ITEMS } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
})
export class AddSupplierComponent {
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
    if (this.router.url !== "add-supplier") {
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
      const result = await networkRequest.send(`${BACKEND_URL}/Supplier/${id}`, "GET");

      console.log(result);

      if (!result) {
        this.openSnackBar(`Data not found with id: ${id}`, 'Close');
        this.isLoading = false;
        this.router.navigate([`**`]);
        return;
      }

      this.fetchedData = result;

      this.addContentForm.patchValue({
        supplierName: result.name,
        phone: result.phoneNo,
        email: result.emailId,
        address: result.address,
        city: result.city,
        postalCode: result.postalCode,
        state: result.state,
        country: result.country,
      })
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.openSnackBar(`Unable to load data with id: ${id}`, 'Close');
    }
  }

  // form add suplier
  supplierName: any = new FormControl('', [Validators.required]);
  phone: any = new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]);
  email: any = new FormControl('', [Validators.required, Validators.email]);
  address: any = new FormControl('', [Validators.required]);
  city: any = new FormControl('', [Validators.required]);
  postalCode: any = new FormControl('', [Validators.required]);
  state: any = new FormControl('', [Validators.required]);
  country: any = new FormControl('', [Validators.required]);

  addContentForm: any = new FormGroup({
    supplierName: this.supplierName,
    phone: this.phone,
    email: this.email,
    address: this.address,
    city: this.city,
    postalCode: this.postalCode,
    state: this.state,
    country: this.country,
  });

  formBuilder: any = {
    supplierName: {
      label: 'Supplier Name',
      type: 'text',
      id: 'supplierName',
      name: 'supplierName',
      formControlName: 'supplierName',
      error: '',
    },
    phone: {
      label: 'Phone',
      type: 'text',
      id: 'phone',
      name: 'phone',

      formControlName: 'phone',
      error: '',
    },
    email: {
      label: 'Email',
      type: 'email',
      id: 'email',
      name: 'email',

      formControlName: 'email',
      error: '',
    },
    address: {
      label: 'Address',
      type: 'text',
      id: 'address',
      name: 'address',

      formControlName: 'address',
      error: '',
    },
    city: {
      label: 'City',
      type: 'text',
      id: 'city',
      name: 'city',

      formControlName: 'city',
      error: '',
    },
    state: {
      label: 'State',
      type: 'text',
      id: 'state',
      name: 'state',

      formControlName: 'state',
      error: '',
    },
    postalCode: {
      label: 'Postal Code',
      type: 'text',
      id: 'postalCode',
      name: 'postalCode',

      formControlName: 'postalCode',
      error: '',
    },
    country: {
      label: 'Country',
      type: 'text',
      id: 'country',
      name: 'country',
      formControlName: 'country',
      error: '',
    },
  };

  formBuilderArray: any[] = Object.values(this.formBuilder);

  async onSubmit() {
    this.getAllFormErrors();

    if (this.addContentForm.valid) {
      // Submit the login form
      const payload = {
        supplierName: this.addContentForm.value.supplierName,
        phone: this.addContentForm.value.phone,
        email: this.addContentForm.value.email,
        address: this.addContentForm.value.address,
        city: this.addContentForm.value.city,
        postalCode: this.addContentForm.value.postalCode,
        state: this.addContentForm.value.state,
        country: this.addContentForm.value.country,
      };

      console.log(payload);
      this.isLoading = true;

      try {
        let url, method;
        if (this.router.url === "add-supplier") {
          url = `${BACKEND_URL}/Supplier/register`;
          method = "POST"
        } else {
          const id = this.fetchedData['supplierId'];
          url = `${BACKEND_URL}/Supplier/${id}`;
          method = "PUT"
        }

        const result = await networkRequest.send(url, method, payload);;
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
