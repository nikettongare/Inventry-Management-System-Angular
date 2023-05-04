import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MetaviewComponent } from './metaview/metaview.component';
import { FournotfourComponent } from './fournotfour/fournotfour.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddSalesOrderComponent } from './add-sales-order/add-sales-order.component';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { AsidePanelComponent } from './aside-panel/aside-panel.component';
import { AppbarComponent } from './appbar/appbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MetaviewComponent,
    FournotfourComponent,
    DialogComponent,
    AddSupplierComponent,
    ProfileComponent,
    AddProductComponent,
    AddSalesOrderComponent,
    AddPurchaseOrderComponent,
    AsidePanelComponent,
    AppbarComponent,
  ],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule { }
