import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardsComponent } from './boards/boards.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { NestedPlannerComponent } from './nested-planner/nested-planner.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  { path: 'workflow', component: BoardsComponent },
  {
    path: '', component: WorkflowComponent,
    children: [
      { path: '', component: NestedPlannerComponent },
      { path: 'timeline', component: TimelineComponent },
      { path: 'status', component: StatusComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
