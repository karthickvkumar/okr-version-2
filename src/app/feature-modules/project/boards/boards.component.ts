import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core-services/common.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  hasTeams: boolean = false;
  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.commonService.setHeaderStore(false);
  }

  gotoBoard() {
    this.commonService.setHeaderStore(true);
    this.router.navigateByUrl('/workflow');
  }

}
