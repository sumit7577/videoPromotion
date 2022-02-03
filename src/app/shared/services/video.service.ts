import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IVideo, VideoOrientation } from '../models/iVideo.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private _videoBase64Str$: BehaviorSubject<IVideo>;

  constructor() {
    this._videoBase64Str$ = new BehaviorSubject(null);
  }

  public async setVideo(videoFile: FileList): Promise<any> {
    let videoArray:any[]=[];
    if (!videoFile) return;
    let videoObj;
    for (let index = 0; index < videoFile.length; index++) {
      let videoBase64Str = await this.convertToBase64(videoFile[index]);
      videoObj = await this.prepareVideo(videoBase64Str);
      videoArray.push(videoObj);
    }
    return videoArray;
  }

  public async setVideoForedit(videoFile: any): Promise<void> {
    if (!videoFile) return;
    this._videoBase64Str$.next(null);
    let videoBase64Str = await this.convertToBase64(videoFile);
    let videoObj = await this.prepareVideo(videoBase64Str);
    this._videoBase64Str$.next(videoObj);
  }

  public get Base64String() {
    return this._videoBase64Str$.asObservable();
  }

  private prepareVideo(base64String: string): Promise<IVideo>  {
    return new Promise<IVideo>((resolve, reject) => {
      const videoElem = document.createElement("video");
      try {
        videoElem.style.display = "none";
        document.body.appendChild(videoElem);
        videoElem.src = base64String;
        videoElem.onloadeddata = () => {
          resolve(<IVideo>{
            base64String: base64String,
            orientation: videoElem.videoWidth > videoElem.videoHeight ?
            VideoOrientation.Landscape : VideoOrientation.Potrait
        });
          videoElem.remove();
        }
      }
      catch (err) {
        reject(err);
        videoElem.remove();
      }
    });    
  }

  private convertToBase64(file: File): Promise<string | any> {
    return new Promise((myresolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => myresolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
