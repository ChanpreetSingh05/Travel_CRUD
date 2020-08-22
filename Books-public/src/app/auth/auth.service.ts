import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private userId: string;
  private admin = false;
  private isadmin: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminListener() {
    return this.adminStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getAdmin() {
    return this.admin;
  }

  createUser(email: string, password: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        return response;
      });
  }

  login(email: string, password: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; isadmin: boolean }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = response.userId;
          this.admin = response.isadmin;
          console.log(this.admin);
          this.adminStatusListener.next(this.admin);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          if (this.admin === true) {
            this.isadmin = 'true';
            this.saveAuthData(token, expirationDate, this.userId, this.isadmin);
            this.router.navigate(['/admin']);
          } else {
            this.isadmin = 'false';
            this.saveAuthData(token, expirationDate, this.userId, this.isadmin);
            this.router.navigate(['/']);
          }
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isadmin = authInformation.isadmin;
      if (this.isadmin === 'true') {
        this.admin = true;
      } else {
        this.admin = false;
      }
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.adminStatusListener.next(this.admin);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.admin = false;
    this.authStatusListener.next(false);
    this.adminStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, isadmin: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('isadmin', isadmin);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('isadmin');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const isadmin = localStorage.getItem('isadmin');

    if (!token || !expirationDate) {
      return;
    }
    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      expirationDate: new Date(expirationDate),
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId,
      // tslint:disable-next-line: object-literal-shorthand
      isadmin: isadmin
    };
  }
}
