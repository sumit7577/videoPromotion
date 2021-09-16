import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { finalize, mergeMap } from 'rxjs/operators';
import { LoaderService } from '../components/loader/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loginSvc: LoginService,
    private loaderSvc: LoaderService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loaderSvc.startLoading();
    return this.loginSvc.LogggedInUser.pipe(
      mergeMap(user => {
        request = this.addHeaders(request, user?.token);
        return next.handle(request);
      }),
      finalize(() => {
        this.loaderSvc.stopLoading();
      })
    );
  }

  /**Adds required http headers and authentication token too. */
  addHeaders(req:HttpRequest<any>, authToken:string): HttpRequest<any>{
    let headers: any={};

    if(!req.headers.has("content-type"))
    headers["content-type"]="application/json; charset=utf-8";
    else
    headers["content-type"]=req.headers.get("content-type");

    if(!req.headers.has("accept"))
    headers["accept"]="application/json";
    else
    headers["accept"]=req.headers.get("accept");
      
    if(authToken!=null && authToken.length>0){
      headers["Authorization"]=`Bearer ${authToken}`;
    }
      req = req.clone({
        setHeaders: headers
      });
    return req;
  }
}
