import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { BoardsComponent } from './boards/boards.component';
import { SettingsComponent } from './settings/settings.component';
import { NestedPlannerComponent } from './nested-planner/nested-planner.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [BoardsComponent, SettingsComponent, NestedPlannerComponent, TimelineComponent, StatusComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
