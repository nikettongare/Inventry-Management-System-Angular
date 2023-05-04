import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { APP_NAME, BACKEND_URL } from 'src/config';
import { MatSnackBar } from '@angular/material/snack-bar';
import networkRequest from 'src/utils/NetworkRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, private titleService: Title, private metaService: Meta) { }
  isLoading: boolean = false;

  // Fetch from backend and then update
  userData: { [key: string]: any } = {
    name: "Unknown User"
  }

  CardList: any[] = [
    {
      title: "Total Purchase",
      subtitle: "00",
      image: "assets/shopping-cart.png"
    }, {
      title: "Total Products",
      subtitle: "00",
      image: "assets/cubes.png"
    }, {
      title: "Total Sales",
      subtitle: "00",
      image: "assets/economy.png"
    }, {
      title: "Suppliers",
      subtitle: "00",
      image: "assets/store.png"
    },
  ]

  ngOnInit(): void {
    // Update the page title
    this.titleService.setTitle(`${APP_NAME} | Dashboard`);

    // Update the meta tags
    this.metaService.updateTag({ name: 'description', content: `Welcome To ${APP_NAME}` });
    this.metaService.updateTag({ name: 'keywords', content: `${APP_NAME}, dashboard` });

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

  async fetchUsersData(email: string) {
    try {
      const result = await networkRequest.send(`${BACKEND_URL}/User?EmailId=${email}`, "GET")

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
    this.isLoading = true;
    try {
      const [purchaseRes, productRes, salesRes, supplierRes] = await Promise.all([
        networkRequest.send(`${BACKEND_URL}/PurchaseOrder`, "GET"),
        networkRequest.send(`${BACKEND_URL}/Product`, "GET"),
        networkRequest.send(`${BACKEND_URL}/SalesOrder`, "GET"),
        networkRequest.send(`${BACKEND_URL}/Supplier`, "GET"),
      ]);

      console.log(purchaseRes, productRes, salesRes, supplierRes);

      if (!purchaseRes || !productRes || !salesRes || !supplierRes) {
        this.openSnackBar(`Unable to load the home statics data.`, 'Close');
        this.isLoading = false;
        return;
      }

      const purchaseCount = purchaseRes.length;
      const productCount = productRes.length;
      const salesCount = salesRes.length;
      const supplierCount = supplierRes.length;

      this.CardList.forEach((card) => {
        if (card.title === "Total Purchase") {
          card.subtitle = purchaseCount
        }
        else if (card.title === "Total Products") {
          card.subtitle = productCount
        }
        else if (card.title === "Total Sales") {
          card.subtitle = salesCount
        }
        else if (card.title === "Suppliers") {
          card.subtitle = supplierCount
        }
      })
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
