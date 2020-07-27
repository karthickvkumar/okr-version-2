import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private headerStore = new BehaviorSubject(false);
  subscribeHeaderStore = this.headerStore.asObservable();

  constructor() { }

  setHeaderStore(data: boolean) {
    this.headerStore.next(data)
  }
}
