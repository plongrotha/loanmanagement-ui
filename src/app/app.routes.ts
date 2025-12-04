import { Routes } from '@angular/router';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { LoadApplicationComponent } from './page/load-application/load-application.component';
import { MasterLayoutComponent } from './components/master-layout/master-layout.component';
import { ApplicationComponent } from './page/application/application.component';
import { DeptorComponent } from './page/deptor/deptor.component';
import { AdminComponent } from './page/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: MasterLayoutComponent,
  },
  {
    path: 'loan',
    component: LoadApplicationComponent,
  },
  {
    path: 'application',
    component: ApplicationComponent,
  },
  {
    path: 'debtors',
    component: DeptorComponent,
  },

  { path: 'admin', component: AdminComponent },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
