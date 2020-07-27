import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  validateForm: FormGroup;
  @Input() board: any;

  constructor(private modal: NzModalRef, private fb: FormBuilder) { }

  ngOnInit() {
    const board = this.board;
    this.validateForm = this.fb.group({
      title: [board && board.title ? board.title : '', Validators.required],
      description: [board && board.description ? board.description : ''],
      assignedMembers: [board && board.members ? board.members : []],
    });
  }

  onSave(): void {
    this.modal.destroy(this.validateForm.value);
  }

  onDelete() {

  }

  onCancel() {
    this.modal.destroy();
  }

}
