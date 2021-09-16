import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ITag } from '../../models/iTag.model';
import { ITagItem } from '../../models/iTagItem.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag: ITag;

  readonly blackColor: string = "#454142";

  @ViewChild("svgRef") svgRef: ElementRef;
  
  constructor() { }

  ngOnInit(): void {
  }

  public showSecondLine(tagItem: ITagItem) {
    return tagItem.currency || tagItem.price > 0;
    // return true;
  }

  public getVerticalPosition(isTop?: boolean) {
    let position;
    if (isTop) {
      position = this.tag.bottomItem ? 30 : 50;
    }
    else {
      position = 70;
    }

    if (this.showSecondLine(isTop ? this.tag.topItem : this.tag.bottomItem)) {
      position -= 10;
    }

    return position + '%';
  }

  public getBottomLine(tagItem: ITagItem) {
    return (tagItem.currency ? tagItem.currency : '') +
      (tagItem.price > 0 ? tagItem.price : '');
  }

  public get SVG(): Element {
    return this.svgRef.nativeElement;
  }

}
