import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChartComponent } from './chart/chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './management/users/users.component';
import { DoctorsComponent } from './management/doctors/doctors.component';
import { HospitalsComponent } from './management/hospitals/hospitals.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { DoctorComponent } from './management/doctors/doctor/doctor.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { title: 'Progress Bar' },
      },
      {
        path: 'chart',
        component: ChartComponent,
        data: { title: 'Chart' },
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { title: 'Account Settings' },
      },
      {
        path: 'promises',
        component: PromisesComponent,
        data: { title: 'Promises' },
      },
      { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'User profile' },
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Users' },
      },
      {
        path: 'hospitals',
        component: HospitalsComponent,
        data: { title: 'Hospitals' },
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        data: { title: 'Doctors' },
      },
      {
        path: 'doctor/:id',
        component: DoctorComponent,
        data: { title: 'Doctor' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
