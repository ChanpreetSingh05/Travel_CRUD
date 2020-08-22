import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GetBooksComponent } from './Books/get-books/get-books.component';
import { DetailsBooksComponent } from './Books/details-books/details-books.component';
import { CreateBooksComponent } from './Books/create-books/create-books.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGetComponent } from './Books/admin-get/admin-get.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomepageComponent },
  { path: 'list', component: GetBooksComponent },
  {
    path: 'admin', component: AdminGetComponent,
    children: [
      { path: '', component: AdminGetComponent }
    ]
  },
  { path: 'details/:ID', component: DetailsBooksComponent },
  { path: 'create', component: CreateBooksComponent, canActivate: [AuthGuard] },
  { path: 'edit/:ID', component: CreateBooksComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
