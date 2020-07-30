import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from '../../../core-services/api.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss'],
})
export class EditCardComponent implements OnInit {

  @Input() card: any;
  formGroup: FormGroup;
  dateRange = [];
  editInprogress: boolean = false;
  deleteInprogress: boolean = false;
  cardStatus = [{ name: 'ToDo', color: '#3f51b5' }, { name: 'InProgress', color: '#ff9800' }, { name: 'Pending', color: '#e91e63' }, { name: 'Done', color: '#4caf50' }]

  constructor(private modal: NzModalRef, public formBuilder: FormBuilder, private boardAPI: ApiService) {
  }

  ngOnInit() {
    const card = this.card;
    const startDate = card.selectedDate && card.selectedDate.start ? card.selectedDate.start : new Date();
    const endDate = card.selectedDate && card.selectedDate.end ? card.selectedDate.end : new Date();

    this.formGroup = this.formBuilder.group({
      title: [card && card.title ? card.title : '', Validators.required],
      description: [card && card.description ? card.description : ''],
      author: [card && card.author ? card.author : ''],
      image: [card && card.image ? card.image : ''],
      tags: [card && card.tags ? card.tags : []],
      status: [card && card.status ? card.status : ''],
      createdAt: [card && card.createdAt ? card.createdAt : new Date()],
      selectedDate: [[startDate, endDate], Validators.required],
    });
  }

  onSave(): void {
    this.editInprogress = true;
    Object.assign(this.card, this.formGroup.value);
    this.boardAPI.editCard(this.card).subscribe((response) => {
      this.editInprogress = false;
      this.modal.destroy(this.formGroup.value);
    },
      (error) => {
        this.boardAPI.notification()
      })
  }

  onDelete() {
    this.deleteInprogress = true;
    if (this.card.talks.length) {
      this.deleteInprogress = false;
      this.boardAPI.warning("Can't delete a parent card");
      return;
    }
    this.boardAPI.deleteCard(this.card._id).subscribe((response) => {
      this.deleteInprogress = false;
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
