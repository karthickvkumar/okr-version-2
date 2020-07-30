import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss']
})
export class InlineEditComponent implements OnInit {

  @Input() data: number;
  @Output() focusOut: EventEmitter<number> = new EventEmitter<number>();
  @ViewChildren('addHolderInput') textarea: any;
  editMode = false;
  constructor() { }

  ngOnInit() { }

  onFocusOut() {
    this.focusOut.emit(this.data);
  }

  onEdit() {
    this.editMode = true;
    setTimeout(() => {
      this.textarea.first.nativeElement.focus();
    }, 50);
  }


}
