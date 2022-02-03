import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { APIRoutes } from '../constants/api-route.constants';
import { ILogin } from '../models/iLogin.model';
import { IUser } from '../models/iUser.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUser$: BehaviorSubject<IUser>;

  constructor(private http: HttpClient) {
    this.loginUser$ = new BehaviorSubject(null);
  }

  public get LogggedInUser() {
    return this.loginUser$.asObservable();
  }

  signInUser(loginCredentials: ILogin) {
    return this.http.post<any>(APIRoutes.SignIn, loginCredentials)
    .pipe(tap((user:any) => {
      this.loginUser$.next(<IUser>{
        username: loginCredentials.username,
        token: user['token']
      });
    }));
  }

  signOut() {
    return this.http.post(APIRoutes.Logout, { username: this.loginUser$.value?.username })
    .pipe(map(()=>{
      this.loginUser$.next(null);
    }));
  }
}
