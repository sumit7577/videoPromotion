import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITag } from '../../models/iTag.model';
import { Currency } from '../../models/iTagItem.model';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() tags: ITag[];
  @Input() selectedTag: ITag;
  @Output() onTagSelect: EventEmitter<ITag>;

  // selectedTagName: string;
  creationTimeStamp: string;

  constructor() {
    this.onTagSelect = new EventEmitter<ITag>();
    this.creationTimeStamp = new Date().getTime().toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if ('selectedTag' in changes && this.tags?.length > 0 && this.selectedTag &&
    // this.selectedTagName!==this.selectedTag.) {
    //   let found = this.tags.find(x => x.name = this.selectedTag.name);
    //   if(found)
    //     this.selectedTagName = found.name;
    // }
  }

  ngOnInit(): void {
  }

  selectTag(tag: ITag) {
    this.selectedTag = JSON.parse(JSON.stringify(tag));
    // this.selectedTagName = this.selectedTag.name;
    this.onTagSelect.emit(this.selectedTag);
  }

  public getCurrencyEnumValue(key: keyof typeof Currency) {
    return Currency[key];
  }

  public get CurrencyArray() {
    return <(keyof typeof Currency)[]>Object.keys(Currency);
  }

  public trackByName(index: number, tag: ITag) {
    // return tag.name;
    return index
  }

}
