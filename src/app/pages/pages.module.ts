import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChartComponent } from './chart/chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './management/users/users.component';
import { HospitalsComponent } from './management/hospitals/hospitals.component';
import { DoctorsComponent } from './management/doctors/doctors.component';
import { PipesModule } from '../pipes/pipes.module';
import { DoctorComponent } from './management/doctors/doctor/doctor.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    ChartComponent,
    PagesComponent,
    AccountSettingsComponent,
    PromisesComponent,
    RxjsComponent,
    ProfileComponent,
    UsersComponent,
    HospitalsComponent,
    DoctorsComponent,
    DoctorComponent,
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    ChartComponent,
    PagesComponent,
    AccountSettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
})
export class PagesModule {}
