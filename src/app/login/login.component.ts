import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import networkRequest from 'src/utils/NetworkRequest';
import { Title, Meta } from '@angular/platform-browser';
import { APP_NAME, BACKEND_URL } from 'src/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, private router: Router, private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | Login`);

    // Update the meta tags
    this.metaService.updateTag({ name: 'description', content: `Please Login into the ${APP_NAME}` });
    this.metaService.updateTag({ name: 'keywords', content: `${APP_NAME}, login, signin` });

    // check for user authentication
    const xAuth = localStorage.getItem("x-auth");

    if (xAuth) {
      console.log('User Already logged In.');
      this.router.navigate(['/']);
    }
  }

  email: any = new FormControl('', [Validators.required, Validators.email]);
  password: any = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]);

  isLoading: boolean = false;

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  });

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      // Submit the login form
      const payload = {
        EmailId: this.loginForm.value.password,
        password: this.loginForm.value.email,
      };

      console.log(payload);
      this.isLoading = true;

      try {
        const queryString = new URLSearchParams(payload).toString();
        const result = await networkRequest.send(`${BACKEND_URL}/user/login?${queryString}`, "POST")
        console.log(result);

        if (!result) {
          this.openSnackBar(`Unable to login user.`, 'Close');
          this.isLoading = false;
          return;
        }

        this.isLoading = false;

        localStorage.setItem('x-auth', JSON.stringify({ email: payload.EmailId }));
        this.openSnackBar(`User Authenticated`, 'Close');
        this.router.navigate(['/']);
      } catch (error: any) {
        console.log(error);
        this.openSnackBar(`${error.message || error}`, 'Close');
        this.isLoading = false;
      }
    }
  }
}
