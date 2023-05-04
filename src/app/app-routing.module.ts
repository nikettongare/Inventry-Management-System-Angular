import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FournotfourComponent } from './fournotfour/fournotfour.component';
import { MetaviewComponent } from './metaview/metaview.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'view/:name', component: MetaviewComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'add-supplier/:id', component: AddSupplierComponent },
  { path: '**', component: FournotfourComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
