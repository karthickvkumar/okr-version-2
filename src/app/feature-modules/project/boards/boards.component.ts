import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core-services/common.service';
import { ApiService } from '../../../core-services/api.service';

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

  heightOffset: number = 65;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute, private boardAPI: ApiService) { }

  ngOnInit() {
    this.commonService.setHeaderStore(false);
    this.userId = localStorage.getItem('userId');
    // this.listBoards();
  }

  listBoards() {
    this.isLoading = true;
    this.boardAPI.getBoards(this.userId).subscribe((response: any[]) => {
      this.isLoading = false;
      this.boardList = response;
      if (this.boardList.length > 0) this.boardAPI.notification("Board are loaded successfully");
      if (this.boardList.length == 0) this.boardAPI.notification("There are no boards to display");
    },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification()
      })
  }

  newBoard(event) {
    event.preventDefault();
    const board = {
      title: "Board Title",
      description: "Lorem ipsum dolor sit amet elit nisi, adipiscing consectetur.",
      userId: this.userId
    }
    this.boardList.push(board);
    // this.boardAPI.createBoard(board).subscribe((response: any) => {
    //   Object.assign(board, response);
    //   this.boardAPI.notification("Board created successfully");
    // },
    //   (error) => {
    //     this.boardList.pop();
    //     this.boardAPI.notification()
    //   });
  }

  editBoard(board) {
    // this._dialog.open(EditTalkComponent, { data: { card: board }, width: '500px' })
    //   .afterClosed()
    //   .subscribe((newBoardData) => {
    //     Object.assign(board, newBoardData);
    //     this.boardAPI.editBoard(board).subscribe((response) => {
    //       this.boardAPI.notification("Board updated successfully");
    //     },
    //       (error) => {
    //         this.boardAPI.notification()
    //       })
    //   });
  }

  deleteBoard(board, index) {
    this.boardList.splice(index, 1);
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

}
