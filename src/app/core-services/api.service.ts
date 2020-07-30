import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private alert: NzNotificationService) { }
  baseURL: string = "https://fpslabs.herokuapp.com/api"

  login(data) {
    let url: string = this.baseURL + "/login";
    return this.http.post(url, data);
  }

  signup(data) {
    let url: string = this.baseURL + "/signup";
    return this.http.post(url, data);
  }

  createBoard(board) {
    let url: string = this.baseURL + "/board/add";
    return this.http.post(url, board);
  }

  getBoards(userId) {
    let url: string = this.baseURL + "/boards/" + userId;
    return this.http.get(url);
  }

  editBoard(board) {
    let url: string = this.baseURL + "/board/edit";
    return this.http.put(url, board);
  }

  deleteBoard(boardId) {
    let url: string = this.baseURL + "/board/delete/" + boardId;
    return this.http.delete(url);
  }

  getCards(boardId) {
    let url: string = this.baseURL + "/cards/" + boardId;
    return this.http.get(url);
  }

  createCard(card) {
    let url: string = this.baseURL + "/card/add";
    return this.http.post(url, card);
  }

  editCard(card) {
    let url: string = this.baseURL + "/card/edit";
    return this.http.put(url, card);
  }

  reorder(positions) {
    let url: string = this.baseURL + "/card/reorder";
    return this.http.put(url, positions);
  }

  deleteCard(cardId) {
    let url: string = this.baseURL + "/card/delete/" + cardId;
    return this.http.delete(url);
  }

  notification() {
    this.alert.create(
      'error',
      'Error',
      'Server Error, Please try again later'
    );
  }

  warning(message) {
    this.alert.create(
      'warning',
      'Warning',
      message
    );
  }
}
