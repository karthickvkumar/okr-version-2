import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  isSettingsVisible: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  openSettings() {
    this.isSettingsVisible = true;
  }

  closeSettings() {
    this.isSettingsVisible = false;
  }

  goToPlanner() {
    this.router.navigateByUrl('/');
  }

  goToTimeline() {
    this.router.navigateByUrl('/timeline');
  }

  goToStatus() {
    this.router.navigateByUrl('/status');
  }
}
