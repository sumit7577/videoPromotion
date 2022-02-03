import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { VideoApiService } from 'src/app/shared/services/video-api.service';
import { VideoService } from 'src/app/shared/services/video.service';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {
  selectedFile: FileList;
  selectedFileName:string="Choose File";
  constructor(
    private videoSvc: VideoService,
    private router: Router,
    private videoAPISvc: VideoApiService,
    private commonSvc: CommonService,
    private loaderSvc: LoaderService
  ) { }

  ngOnInit(): void {
  }

  onFileChange(files: FileList) {
    if(files?.length > 0) this.selectedFile = files
    this.selectedFileName="";
    for (let index = 0; index < this.selectedFile.length; index++) {
     this.selectedFileName+=this.selectedFile[index].name;
    
    }
  }

  async uploadVideo() {
    if (!this.selectedFile) return;
  let videoArrayList=await this.videoSvc.setVideo(this.selectedFile);
  this.videoAPISvc.uploadRawVideo(videoArrayList).subscribe( async (arrayBuffer: ArrayBuffer) => {
    const arrBuf = arrayBuffer;
    const blob = new Blob([arrBuf], {
      type: 'video/mp4'
    });
    await this.videoSvc.setVideoForedit(blob);
    this.loaderSvc.stopLoading();
    this.router.navigate(['edit']);
  },(err)=> {
    this.commonSvc.handleError(err, "The video was not uploaded. Something didn't work fine.");
  });
  //    this.videoSvc.Base64String.pipe(
  //     mergeMap((_video:any) => {
  //       return this.videoAPISvc.uploadRawVideo(_video)
  //     }),

  //     take(1)
  //   ).subscribe(()=>{
  //     this.router.navigate(['edit']);
  //   },
  //   (err)=> {
  //     this.commonSvc.handleError(err, "The video was not uploaded. Something didn't work fine.");
  //   });
   }

}
