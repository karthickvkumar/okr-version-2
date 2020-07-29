import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from '../../core-services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerOption: boolean;
  user: any = {};
  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.subscribeHeaderStore.subscribe(data => this.headerOption = data);
    const userAuth = JSON.parse(localStorage.getItem('user'));
    if (userAuth && userAuth._id) {
      this.user = userAuth;
    }
  }

  goToBoards() {
    this.router.navigateByUrl('');
  }

  goToPlanner() {
    this.router.navigateByUrl('/workflow');
  }

  goToTimeline() {
    this.router.navigateByUrl('/workflow/timeline');
  }

  goToStatus() {
    this.router.navigateByUrl('/workflow/status');
  }

  onLogout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
