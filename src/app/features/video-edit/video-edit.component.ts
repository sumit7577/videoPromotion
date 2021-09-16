import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TagComponent } from 'src/app/shared/components/tag/tag.component';
import { ITag } from 'src/app/shared/models/iTag.model';
import { Currency } from 'src/app/shared/models/iTagItem.model';
import { IVideo, VideoOrientation } from 'src/app/shared/models/iVideo.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { IUploadTag, VideoApiService } from 'src/app/shared/services/video-api.service';
import { VideoService } from 'src/app/shared/services/video.service';
import { ModalService } from 'src/app/_modal';
import { AvailableIconsPaths, LeftSideTags } from './tags.constant';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.scss']
})
export class VideoEditComponent implements OnInit, OnDestroy {
  video: IVideo;
  videoOrientation: VideoOrientation;
  leftSideTags: ITag[];
  selectedLeftTag: ITag;
  selectedRightTag: ITag;
  firstSelectedIcon: string;
  secondSelectedIcon: string;
  currencyEnum = Currency;
  availableIcons: string[];
  private videoSubscription: Subscription | null;
  previewvideo: HTMLVideoElement;
  arrBuf: any;
  savedsuccess: boolean;

  @ViewChild("leftTagRef") leftTagRef: TagComponent;
  @ViewChild("rightTagRef") rightTagRef: TagComponent;

  constructor(
    private videoSvc: VideoService,
    private imageSvc: ImageService,
    private router: Router,
    private videoAPISvc: VideoApiService,
    private notificationSvc: NotificationService,
    private commonSvc: CommonService,
    private modalService: ModalService
  ) {
    this.video = null;
    this.videoSubscription = null;
    this.leftSideTags = JSON.parse(JSON.stringify(LeftSideTags));
    this.availableIcons = JSON.parse(JSON.stringify(AvailableIconsPaths));
  }

  ngOnInit(): void {
    this.subscribeToVideo();
  }

  private subscribeToVideo() {
    this.videoSubscription = this.videoSvc.Base64String.subscribe(videoObj => {
      this.video = videoObj;
    });

    // this.videoAPISvc.downloadVideo().pipe(take(1))
    // .subscribe(video=> this.video=video,
    // (err) => {
    //   this.commonSvc.handleError(err, "The video was not downloaded. Something didn't work fine.");
    // });
  }

  selectLeftTag(tag: any) {
    this.selectedLeftTag = tag;
  }

  selectRightTag(tag: any) {
    this.selectedRightTag = tag;
  }

  uploadNewVideo() {
    this.router.navigate([""]);
  }

  async saveVideo(rotate?: boolean) {
    debugger
    let tags: IUploadTag[] = [];
    let icons: any[] = [];

    if (this.leftTagRef) {
      console.log('Tagposition x: ' + this.leftTagRef.SVG.parentElement.parentElement.getAttribute('PositionX'));
     
      tags.push({
        image: await this.imageSvc.convertSvgToBase64PNG(this.leftTagRef.SVG),
        location: "left",
        coord: {
          x: this.leftTagRef.SVG.parentElement.parentElement.getAttribute('PositionX')!= null?this.leftTagRef.SVG.parentElement.parentElement.getAttribute('PositionX'):this.leftTagRef.SVG.parentElement.parentElement.offsetLeft.toString(),
          y: this.leftTagRef.SVG.parentElement.parentElement.getAttribute('PositionY')!= null?this.leftTagRef.SVG.parentElement.parentElement.getAttribute('PositionY'):this.leftTagRef.SVG.parentElement.parentElement.offsetTop.toString()
        },
      });
    }

    if (this.rightTagRef) {
      tags.push({
        image: await this.imageSvc.convertSvgToBase64PNG(this.rightTagRef.SVG),
        location: "right",
        coord: {
          x: this.rightTagRef.SVG.parentElement.parentElement.getAttribute('PositionX')!= null?(parseInt(this.rightTagRef.SVG.parentElement.parentElement.getAttribute('PositionX'))-(this.leftTagRef.SVG.parentElement.parentElement.offsetLeft*2)).toString():(this.rightTagRef.SVG.parentElement.parentElement.offsetLeft-(this.leftTagRef.SVG.parentElement.parentElement.offsetLeft*2)).toString(),
          y: this.rightTagRef.SVG.parentElement.parentElement.getAttribute('PositionY')!= null?this.rightTagRef.SVG.parentElement.parentElement.getAttribute('PositionY'):this.rightTagRef.SVG.parentElement.parentElement.offsetTop.toString()
        },
      });
    }

    if (this.firstSelectedIcon) {
      icons.push({
        image: await this.imageSvc.imgPathToBase64(this.firstSelectedIcon),
        location: 'left'
      });
    }

    if (this.secondSelectedIcon) {
      icons.push({
        image: await this.imageSvc.imgPathToBase64(this.secondSelectedIcon),
        location: 'right'
      });
    }

    this.videoAPISvc.postVideoEdits(tags, icons, rotate)
      .pipe(take(1))
      .subscribe((arrayBuffer: ArrayBuffer) => {
        this.arrBuf = arrayBuffer;
        this.commonSvc.downloadFile(arrayBuffer, "video/mp4", true);
        this.resetValues();
        this.savedsuccess = true;
        this.notificationSvc.alert("The edits has been saved successfully.", "S");
      },
        err => this.commonSvc.handleError(err));
  }

  // previewVideo() {

  //   this.previewvideo = document.querySelector('video');
  //   if ('MediaSource' in window && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
  //     var mediaSource = new MediaSource;
  //     //console.log(mediaSource.readyState); // closed
  //     this.previewvideo.src = URL.createObjectURL(mediaSource);
  //     mediaSource.addEventListener('sourceopen', this.sourceOpen.bind(this));
  //   } else {
  //     console.error('Unsupported MIME type or codec: ', 'video/mp4; codecs="avc1.64001e, mp4a.40.2"');
  //   }

  //   const videoSourceBuffer = myMediaSource
  //     .addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
  //   videoSourceBuffer.appendBuffer(data)
  // }

  sourceOpen(e: any) {
    const that = this;
    var mediaSource = e.target;
    var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001e, mp4a.40.2"');
    sourceBuffer.addEventListener('updateend', function (args: any) {
      if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
        mediaSource.endOfStream();
      }
      that.previewvideo.play();
    });
    sourceBuffer.appendBuffer(this.arrBuf);
  };

  arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  onIconSelect(position: 'left' | 'right', icon: string) {
    if (position === "left")
      this.firstSelectedIcon = icon;
    else if (position === "right")
      this.secondSelectedIcon = icon;
  }

  resetValues() {
    this.selectedLeftTag = null;
    this.selectedRightTag = null;
    this.firstSelectedIcon = null;
    this.secondSelectedIcon = null;
  }

  previewVideo(id: string) {
    this.modalService.open(id);
    this.previewvideo = document.querySelectorAll('video')[1];
    const blob = new Blob([this.arrBuf], {
      type: 'video/mp4'
    });
    this.previewvideo.src = window.URL.createObjectURL(blob);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    const prev: any = document.getElementById("myvideo");
    prev.pause();
    prev.currentTime = 0;
  }
  onDragEnded(event:CdkDragEnd) {
    
    debugger
    let element = event.source.getRootElement();
    // let pos = event.source.getFreeDragPosition();
    let target= document.getElementById('videodiv')
    const eleRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    // Calculate the top and left positions
    const top = eleRect.top - targetRect.top;
    const left = eleRect.left - targetRect.left;
    
    // let boundingClientRect = element.getBoundingClientRect();
    // let parentPosition = this.getPosition(element);
    // console.log('x: ' + (event.dropPoint.x-parentPosition.left), 'y: ' + (event.dropPoint.y-parentPosition.top));
     element.setAttribute('PositionX',left.toString());
     element.setAttribute('PositionY',top.toString());
    
  }

  getPosition(el:any) {
    let x = 0;
    let y = 0;
    var cd;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      if(el!=null && el.children.length ==3){
        cd={ top:el.children[1].offsetTop, left: el.children[1].offsetLeft };
      }
      el = el.offsetParent;
      
      
    }
    
    return cd;
  }

  ngOnDestroy() {
    if (this.videoSubscription && !this.videoSubscription.closed)
      this.videoSubscription.unsubscribe();
  }
}
