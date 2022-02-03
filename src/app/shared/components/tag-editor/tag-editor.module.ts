import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagEditorComponent } from './tag-editor.component';
import { FormsModule } from '@angular/forms';
import { TagModule } from '../tag/tag.module';



@NgModule({
  declarations: [
    TagEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TagModule
  ],
  exports: [
    TagEditorComponent
  ]
})
export class TagEditorModule { }
