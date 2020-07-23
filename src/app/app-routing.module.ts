import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'boards',
    // pathMatch: 'full',
    loadChildren: () => import('./feature-modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./feature-modules/project/project.module').then((m) => m.ProjectModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
