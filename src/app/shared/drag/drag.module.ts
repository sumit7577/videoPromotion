import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeDraggingDirective } from './free-dragging.directive';



@NgModule({
  declarations: [
    FreeDraggingDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[FreeDraggingDirective]
})
export class DragModule { }
