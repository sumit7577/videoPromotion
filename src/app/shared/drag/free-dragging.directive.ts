import { DOCUMENT } from '@angular/common';
import { Directive, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[appFreeDragging]'
})
export class FreeDraggingDirective implements OnInit, OnDestroy {

  private element: HTMLElement;

  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.initDrag();
  }

  initDrag(): void {
    // main logic will come here
    // 1
    const dragStart$ = fromEvent<MouseEvent>(this.element, "mousedown");
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
      takeUntil(dragEnd$)
    );

    // 2
    let initialX: number,
      initialY: number,
      currentX = 0,
      currentY = 0;

    let dragSub: Subscription;

    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;
      this.element.classList.add('free-dragging');

      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();

        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;

        this.element.style.transform =
          "translate3d(" + currentX + "px, " + currentY + "px, 0)";
      });
    });

    // 5
    const dragEndSub = dragEnd$.subscribe((event: MouseEvent) => {
      // Get the top, left coordinates of two elements
    const eleRect = this.element.getBoundingClientRect();
    //const targetRect = this.targetele.getBoundingClientRect();

// Calculate the top and left positions
    // const top = eleRect.top - targetRect.top;
    // const left = eleRect.left - targetRect.left;
      initialX = currentX;
      initialY = currentY;
      this.element.setAttribute('PositionX',currentX.toString());
      this.element.setAttribute('PositionY',currentY.toString());
      this.element.classList.remove('free-dragging');
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }

}
