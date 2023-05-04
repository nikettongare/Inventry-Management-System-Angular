import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FournotfourComponent } from './fournotfour/fournotfour.component';
import { MetaviewComponent } from './metaview/metaview.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { AddSalesOrderComponent } from './add-sales-order/add-sales-order.component';
import { SupplierViewComponent } from './supplier-view/supplier-view.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { SalesViewComponent } from './sales-view/sales-view.component';

const routes: Routes = [
  // home
  { path: '', component: HomeComponent },
  // login
  { path: 'login', component: LoginComponent },
  // register
  { path: 'register', component: RegisterComponent },
  // user profile
  { path: 'profile', component: ProfileComponent },
  // remove it latter
  { path: 'view/:name', component: MetaviewComponent },
  // supplier
  { path: 'supplier', component: SupplierViewComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'edit-supplier/:id', component: AddSupplierComponent },
  // product
  { path: 'product', component: ProductViewComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: AddProductComponent },
  // purchase order
  { path: 'purchase-order', component: PurchaseViewComponent },
  { path: 'add-purchase-order', component: AddPurchaseOrderComponent },
  { path: 'edit-purchase-order/:id', component: AddPurchaseOrderComponent },
  // sales order
  { path: 'sales-order', component: SalesViewComponent },
  { path: 'add-sales-order', component: AddSalesOrderComponent },
  { path: 'edit-sales-order/:id', component: AddSalesOrderComponent },
  // 404
  { path: '**', component: FournotfourComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
