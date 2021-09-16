import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService{
    private loading$: BehaviorSubject<boolean>;
    
    public get Loading() {
        return this.loading$.asObservable();
    }

    constructor(){
        this.loading$=new BehaviorSubject<boolean>(false);
    }

    startLoading(){
        this.loading$.next(true);
    }

    stopLoading(){
        this.loading$.next(false);
    }
}