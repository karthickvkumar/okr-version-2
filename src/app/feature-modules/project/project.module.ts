import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragScrollModule } from "cdk-drag-scroll";

import { ProjectRoutingModule } from './project-routing.module';
import { BoardsComponent } from './boards/boards.component';
import { SettingsComponent } from './settings/settings.component';
import { NestedPlannerComponent } from './nested-planner/nested-planner.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatusComponent } from './status/status.component';
import { HeaderComponent } from '../../core-components/header/header.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { EditBoardComponent } from './edit-board/edit-board.component';

@NgModule({
  declarations: [
    BoardsComponent,
    SettingsComponent,
    NestedPlannerComponent,
    TimelineComponent,
    StatusComponent,
    HeaderComponent,
    WorkflowComponent,
    EditBoardComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NzTypographyModule,
    NzGridModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropDownModule,
    NzIconModule,
    NzDividerModule,
    NzCardModule,
    NzSkeletonModule,
    NzDrawerModule,
    NzInputModule,
    NzModalModule,
    DragDropModule,
    DragScrollModule
  ],
  entryComponents: [EditBoardComponent]
})
export class ProjectModule { }
