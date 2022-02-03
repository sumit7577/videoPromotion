import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss']
})
export class IconSelectorComponent implements OnInit {
  @Input() title: string;
  @Input() icons: string[];
  @Input() selectedIcon: string;
  @Output() onSelect: EventEmitter<string>;


  constructor() {
    this.onSelect = new EventEmitter();
  }

  ngOnInit(): void {
  }

  onIconClick(icon: string) {
    this.selectedIcon = icon;
    this.onSelect.emit(icon);
  }

}
