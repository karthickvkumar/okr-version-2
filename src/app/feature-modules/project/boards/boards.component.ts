import { Component, OnInit, Input, ElementRef, ViewContainerRef, ViewChildren, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from '../../../core-services/common.service';
import { ApiService } from '../../../core-services/api.service';
import { EditBoardComponent } from '../edit-board/edit-board.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  userId: string;
  boardList: any[] = [];

  hasTeams: boolean = false;
  isLoading: boolean = false;

  disableNewBoard: boolean = true;
  createBoard: FormGroup;
  createBoardLoading: boolean = false;
  @ViewChildren('addBoardInput') textarea: any;

  constructor(private fb: FormBuilder, private renderer: Renderer2, private el: ElementRef, private commonService: CommonService, private router: Router, private route: ActivatedRoute, private boardAPI: ApiService, private modal: NzModalService, private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const userAuth = JSON.parse(localStorage.getItem('user'));
    if (!userAuth) {
      this.router.navigateByUrl('/');
      return;
    }
    this.userId = userAuth._id;
    this.commonService.setHeaderStore(false);
    this.createBoard = this.fb.group({
      boardName: ['', [Validators.required]],
    });
    this.listBoards();
  }

  listBoards() {
    this.isLoading = true;
    this.boardAPI.getBoards(this.userId).subscribe((response: any[]) => {
      this.isLoading = false;
      this.boardList = response;
    },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification()
      })
  }

  addNewBoard(board) {
    this.createBoardLoading = true;
    Object.assign(board, { title: this.createBoard.value.boardName });

    this.boardAPI.createBoard(board).subscribe((response: any) => {
      this.disableNewBoard = true;
      this.createBoardLoading = false;
      Object.assign(board, response);
      Object.assign(board, { untouched: false });
      this.createBoard.setValue({
        boardName: ''
      });
    },
      (error) => {
        this.disableNewBoard = true;
        this.createBoardLoading = false;
        this.boardList.pop();
        this.boardAPI.notification();
      });

  }

  cancelBoard(boards) {
    this.disableNewBoard = true;
    const index = boards.length - 1;
    boards.splice(index, 1);
    this.createBoard.setValue({
      boardName: ''
    });
  }

  newBoard(event) {
    event.stopPropagation();
    this.disableNewBoard = false;
    const board = {
      title: "",
      id: this.generateGuid(),
      description: "",
      userId: this.userId,
      untouched: true
    }
    this.boardList.push(board);
    setTimeout(() => {
      this.textarea.first.nativeElement.focus();
    }, 5);
  }

  editBoard(event, board, index) {
    event.stopPropagation();
    const modal = this.modal.create({
      nzContent: EditBoardComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        board,
      }
    });
    modal.afterClose.subscribe((newBoardData) => {
      if (newBoardData == 'deleted') {
        this.boardList.splice(index, 1);
        return;
      }
      Object.assign(board, newBoardData);
    });
  }

  deleteBoard(board, index) {
    // if (!board._id) {
    //   this.boardAPI.notification();
    //   return;
    // }
    // this._dialog.open(DeleteTalkComponent, { data: board, width: '500px' })
    //   .afterClosed()
    //   .subscribe(response => {
    //     if (!response) return
    //     this.boardList.splice(index, 1);
    //     this.boardAPI.deleteBoard(board._id).subscribe((response) => {
    //       this.boardAPI.notification("Board deleted successfully");
    //     },
    //       (error) => {
    //         this.boardAPI.notification();
    //       })
    //   });
  }

  loadBoard(board) {
    if (board._id) {
      this.router.navigateByUrl('/boards/' + board._id);
    } else {
      this.boardAPI.notification()
    }
  }

  gotoBoard() {
    this.commonService.setHeaderStore(true);
    this.router.navigateByUrl('/workflow');
  }

  generateGuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }
}
