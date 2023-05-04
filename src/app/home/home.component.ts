import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { APP_NAME, BACKEND_URL, NAV_ITEMS } from 'src/config';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, private router: Router, private titleService: Title, private metaService: Meta) { }
  AppName: string = APP_NAME;
  NavItems: any[] = NAV_ITEMS;

  CurrentRoute: string = this.router.url;
  openUserDropdown: boolean = false;
  isLoading:boolean = false;

  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: "Bakasur Chanawala"
  }

  CardList: any[] = [
    {
      title: "Total Purchase",
      subtitle: "20",
      image: "assets/shopping-cart.png"
    }, {
      title: "Total Products",
      subtitle: "40",
      image: "assets/cubes.png"
    }, {
      title: "Total Sales",
      subtitle: "220",
      image: "assets/economy.png"
    }, {
      title: "Suppliers",
      subtitle: "22",
      image: "assets/store.png"
    },
  ]


  ngOnInit(): void {
    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | Dashboard`);

    // Update the meta tags
    this.metaService.updateTag({ name: 'description', content: `Please Login into the ${APP_NAME}` });
    this.metaService.updateTag({ name: 'keywords', content: `${APP_NAME}, login, signin` });

    // check for user authentication
    const xAuth = localStorage.getItem("x-auth");

    if (!xAuth) {
      console.log('User Not Exist Please log In.');
      // this.router.navigate(['/login']);
    }

    if (xAuth) {
      const email = JSON.parse(xAuth).email;
      // this.fetchUsersData(email);
      // this.fetchStatData();
    }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
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

  async fetchStatData() {
    try {
      const result = await networkRequest.send(`${BACKEND_URL}/stat`, "GET")
      console.log(result);

      if (!result) {
        this.openSnackBar(`Userdata not found!`, 'Close');
        this.isLoading = false;
        return;
      }

      //  after card logic | homepage data api pending
      this.CardList.forEach((card) => {

      })
      this.isLoading = false;
    } catch (error: any) {
      console.log(error);
      this.openSnackBar(`${error.message}`, 'Close');
      this.isLoading = false;
    }
  }

  toggleUserDropDown() {
    this.openUserDropdown = !this.openUserDropdown;
    console.log(this.openUserDropdown);
  }
}
