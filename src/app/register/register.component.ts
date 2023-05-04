import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import networkRequest from 'src/utils/NetworkRequest';
import { Title, Meta } from '@angular/platform-browser';
import { APP_NAME, BACKEND_URL } from 'src/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  constructor(private snackBar: MatSnackBar,private router: Router, private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void { 
    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | Register`);

    // Update the meta tags
    this.metaService.updateTag({ name: 'description', content: `Please Register into the ${APP_NAME}` });
    this.metaService.updateTag({ name: 'keywords', content: `${APP_NAME}, Register, signup` });  
    
     // check for user authentication
     const xAuth = localStorage.getItem("x-auth");

     if(xAuth) {
       console.log('User Already logged In.');
       this.router.navigate(['/']);
     }
  }

  name: any = new FormControl('', [Validators.required]);
  phone: any = new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
  email: any = new FormControl('', [Validators.required, Validators.email]);
  password: any = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]);

  isLoading = false;

  registerForm = new FormGroup({
    name: this.name,
    phone:this.phone,
    email: this.email,
    password: this.password
  });

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      // Submit the login form
      const payload = {
        Name: this.registerForm.value.name,
        Phone: this.registerForm.value.phone,
        EmailId: this.registerForm.value.email,
        Password: this.registerForm.value.password,
      };

      console.log(payload);
      this.isLoading = true;

      try {
        const queryString = new URLSearchParams(payload).toString();
        const result = await networkRequest.send(`${BACKEND_URL}/user/register?${queryString}`, "POST")
        console.log(result);
        
        if(!result) {
          this.openSnackBar(`Unable to Registered user.`, 'Close');
          this.isLoading = false;
          return;
        }

        this.isLoading = false;
        this.openSnackBar(`User Registered Successfully!`, 'Close');
        this.router.navigate(['/login']);
      } catch (error: any) {
        console.log(error);
        this.openSnackBar(`${error.message || error}`, 'Close');
        this.isLoading = false;
      }
    }
  }
}
