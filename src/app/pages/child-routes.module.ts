import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChartComponent } from './chart/chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorComponent } from './management/doctors/doctor/doctor.component';
import { DoctorsComponent } from './management/doctors/doctors.component';
import { HospitalsComponent } from './management/hospitals/hospitals.component';
import { UsersComponent } from './management/users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { SearchComponent } from './search/search.component';

const childRoutes: Routes = [
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
    path: 'search/:term',
    component: SearchComponent,
    data: { title: 'Search' },
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
    canActivate: [AdminGuard],
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
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}
