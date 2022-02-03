import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private notificationSvc: NotificationService) { }

  public handleError(err: any, defaultMsg?: string) {
    if (err instanceof HttpErrorResponse) {
      this.notificationSvc.alert(err.message);
      console.error(err);
    }
    else if(err?.error?.message)
    {
      this.notificationSvc.alert(err.error.message);
    }
    else {
      this.notificationSvc
        .alert(defaultMsg ? defaultMsg : "Something didn't work quite right. Please try again.");
      console.error(err);
    }
  }

  public downloadFile(data: any, type: string='application/zip', newLink:boolean=false) {
    const blob = new Blob([data], {
      type: type
    });
    const url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    if (newLink) link.setAttribute("target", "_blank");
    link.style.display = "none";
    link.href = url;
    link.click();
    setTimeout(() => link.remove(), 100);
  }
}
