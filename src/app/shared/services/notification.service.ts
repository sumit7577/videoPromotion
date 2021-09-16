import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  /**
   * Shows a notification.
   * @param message The message to be notified.
   * @param type The type of the error. Default is 'E'
   * @param timeOut The timeout for deleting the alert.
   */
  alert(message: string, type: "S" | "W" | "I" | "E"="E", timeOut?: number){
    let alertClasses: string;
    switch(type.toUpperCase()){
        case "S": alertClasses="customAlert shadow alert success";
          break;
        case "I": alertClasses="customAlert shadow alert info";
          break;
        case "W": alertClasses="customAlert shadow alert warning";
          break;
        case "E":
        default:  alertClasses="customAlert shadow alert danger";
          break;
    };
    if(!timeOut || timeOut <1)
    {
        timeOut=5000;
    }
      
    let elem=document.createElement("div");
    elem.className=alertClasses;
    elem.innerHTML=`<p class="mb-0">${message}</p>
    <button type="button" class="close" data-dismiss="alert">&times;</button>`;

    document.body.appendChild(elem);
    setTimeout(()=>elem.style.top="15%",10);
    setTimeout(()=>{
        elem.remove();
    }, timeOut);
  }
}
