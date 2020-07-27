import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  @Input() board: any;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    console.log(this.board)
  }

  onSave(): void {
    this.modal.destroy(this.board);
  }

}
