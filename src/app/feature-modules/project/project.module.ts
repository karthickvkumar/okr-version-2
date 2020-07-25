import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ProjectRoutingModule } from './project-routing.module';
import { BoardsComponent } from './boards/boards.component';
import { SettingsComponent } from './settings/settings.component';
import { NestedPlannerComponent } from './nested-planner/nested-planner.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatusComponent } from './status/status.component';
import { HeaderComponent } from '../../core-components/header/header.component';
import { WorkflowComponent } from './workflow/workflow.component';

@NgModule({
  declarations: [
    BoardsComponent,
    SettingsComponent,
    NestedPlannerComponent,
    TimelineComponent,
    StatusComponent,
    HeaderComponent,
    WorkflowComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NzGridModule,
    NzLayoutModule,
    NzMenuModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropDownModule,
    NzIconModule,
    NzDividerModule,
    NzCardModule,
    NzSkeletonModule,
    NzDrawerModule,
    DragDropModule
  ]
})
export class ProjectModule { }
