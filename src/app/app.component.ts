import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoaderService } from './shared/components/loader/loader.service';
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Video Editor';
  loaderSubscription: Subscription;
  isLoading: boolean=false;
  isLoggedIn: boolean;
  loginSubscription: Subscription;

  constructor(
    private loaderSvc: LoaderService,
    private loginSvc: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscribeToLoader();
    this.listenToLogin();
  }
  
  ngOnDestroy(): void {
    if (this.loaderSubscription && !this.loaderSubscription.closed)
      this.loaderSubscription.unsubscribe();
    
    if (this.loginSubscription && !this.loginSubscription.closed)
      this.loginSubscription.unsubscribe();
  }

  private subscribeToLoader() {
    this.loaderSubscription = this.loaderSvc.Loading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  private listenToLogin() {
    this.loginSubscription = this.loginSvc.LogggedInUser.subscribe(user => {
      this.isLoggedIn = user != null;
      if (!user)
        this.router.navigate(["/login"]);
    });
  }

  public onLogout() {
    this.loginSvc.signOut().pipe(take(1)).subscribe();
  }

}
