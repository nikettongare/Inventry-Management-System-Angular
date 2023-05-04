import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { APP_NAME, BACKEND_URL } from 'src/config';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  constructor(private snackBar: MatSnackBar, private router: Router, private titleService: Title, private metaService: Meta) { }
  isLoading: boolean = false;

  name: any = new FormControl('', [Validators.required]);
  phone: any = new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
  password: any = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]);

  profileForm = new FormGroup({
    name: this.name,
    phone: this.phone,
    password: this.password
  });

  userData: { [key: string]: any } = {
    name: "Unknown User",
    phone: "00000000",
    email: "unknown@gmail.com"
  }


  ngOnInit(): void {
    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | Profile`);

    // Update the meta tags
    this.metaService.updateTag({ name: 'description', content: `User's profile ${APP_NAME}` });
    this.metaService.updateTag({ name: 'keywords', content: `${APP_NAME}, profile, user` });

    // check for user authentication
    const xAuth = localStorage.getItem("x-auth");

    if (!xAuth) {
      // this.router.navigate(['/login']);
    }
  
    if (xAuth) {
      const email = JSON.parse(xAuth).email;
      // this.fetchUsersData(email);
    }
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

      // this.profileForm.patchValue({
      //   name: this.userData['name'],
      //   phone: this.userData['phone'],
      //   password: this.userData['password'],
      // });

      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message}`, 'Close');
      this.isLoading = false;
    }
  }

  async onSubmit() { 
    try {
      const result = await networkRequest.send(`${BACKEND_URL}/user`, "PUT")
      console.log(result);

      if (!result) {
        this.openSnackBar(`Something wents wrong, User not updated!`, 'Close');
        this.isLoading = false;
        return;
      }

      if(result) {
        this.openSnackBar(`User Successfully updated!`, 'Close');
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message}`, 'Close');
      this.isLoading = false;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
