import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from '../../../core-services/api.service';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  validateForm: FormGroup;
  editInprogress: boolean = false;
  deleteInprogress: boolean = false;
  @Input() board: any;

  constructor(private modal: NzModalRef, private fb: FormBuilder, private boardAPI: ApiService) { }

  ngOnInit() {
    const board = this.board;
    this.validateForm = this.fb.group({
      id: [board && board._id ? board._id : ''],
      title: [board && board.title ? board.title : '', Validators.required],
      description: [board && board.description ? board.description : ''],
      assignedMembers: [board && board.members ? board.members : []],
    });
  }

  onSave(): void {
    this.editInprogress = true;
    Object.assign(this.board, this.validateForm.value);
    this.boardAPI.editBoard(this.board).subscribe((response) => {
      this.editInprogress = false;
      this.modal.destroy(this.validateForm.value);
    },
      (error) => {
        this.boardAPI.notification()
      })
  }

  onDelete() {
    this.deleteInprogress = true;
    this.boardAPI.deleteBoard(this.board._id).subscribe((response) => {
      this.modal.destroy('deleted');
    },
      (error) => {
        this.modal.destroy(false);
        this.boardAPI.notification();
      })
  }

  onCancel() {
    this.modal.destroy();
  }

}
