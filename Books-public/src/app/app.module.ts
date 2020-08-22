import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateBooksComponent } from './Books/create-books/create-books.component';
import { DetailsBooksComponent } from './Books/details-books/details-books.component';
import { GetBooksComponent } from './Books/get-books/get-books.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminGetComponent } from './Books/admin-get/admin-get.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateBooksComponent,
    DetailsBooksComponent,
    GetBooksComponent,
    HomepageComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    AdminGetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
