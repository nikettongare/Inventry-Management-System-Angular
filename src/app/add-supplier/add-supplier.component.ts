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
  AppName: string = APP_NAME;
  NavItems: any[] = NAV_ITEMS;
  isLoading: boolean = false;
  errorText: string = '';
  openUserDropdown: boolean = false;
  CurrentRoute: string = this.router.url;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit() {
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

    // check for user authentication
    const xAuth = localStorage.getItem('x-auth');

    if (!xAuth) {
      // this.router.navigate(['/login']);
    }

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');

      console.log(id);

      if (id) {
        this.getData(id);
      }
    });
  }

  async getData(id: string) {
    try {
      const result = await  networkRequest.send(`${BACKEND_URL}/PurchaseOrder`, "GET");

      // this.addContentForm.setValue({
      //   supplierName: "Hello",
      //   phone: "Hello",
      //   email: "Hello",
      //   address: "Hello",
      //   city: "Hello",
      //   postalCode: "Hello",
      //   state: "Hello",
      //   country: "Hello",
      // })

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // Temp remove later
  UsersName: string = 'Bakasur Chanawala';

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  toggleUserDropDown() {
    this.openUserDropdown = !this.openUserDropdown;
    console.log(this.openUserDropdown);
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
        const result = await networkRequest.send(
          'https://jsonplaceholder.typicode.com/todos/1'
        );
        console.log(result);
        this.isLoading = false;
        localStorage.setItem('x-auth', JSON.stringify(result));
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
}
