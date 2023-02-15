import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  delay,
  first,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Doctor, Hospital } from 'src/app/models';
import { DoctorService } from 'src/app/services/doctor.service';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: [],
})
export class DoctorComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  public doctorForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    hospital: ['', Validators.required],
  });
  public doctorSelected?: Doctor;
  public hospitals: Hospital[] = [];
  public hospitalSelected?: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private doctorService: DoctorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDoctor();
    this.loadHospitals();
    this.getHospitalSelected();
  }

  loadDoctor(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          id !== 'new'
            ? this.doctorService.getDoctorById(id).pipe(delay(100))
            : of(null)
        ),
        catchError(() => this.router.navigateByUrl(`/dashboard/doctors`)),
        takeUntil(this.destroyed$)
      )
      .subscribe((doctor) => {
        if (!doctor) return;
        const {
          name,
          hospital: { _id },
        } = doctor;
        this.doctorSelected = doctor;
        this.doctorForm.setValue({ name, hospital: _id });
      });
  }

  loadHospitals(): void {
    this.hospitalService
      .loadHospitals()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((hospitals) => {
        this.hospitals = hospitals;
      });
  }

  getHospitalSelected(): void {
    this.doctorForm
      .get('hospital')
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((hospitalId) => {
        this.hospitalSelected = this.hospitals.find(
          ({ _id }) => _id === hospitalId
        );
      });
  }

  saveDoctor(): void {
    if (this.doctorSelected) {
      const data = {
        ...this.doctorForm.value,
        _id: this.doctorSelected._id,
      };
      this.doctorService
        .updateDoctor(data)
        .pipe(first())
        .subscribe({
          next: () => {
            Swal.fire('Updated', 'Doctor updated successfully', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Something went wrong', 'error');
          },
        });
    } else {
      this.doctorService
        .createDoctor(this.doctorForm.value as Doctor)
        .pipe(first())
        .subscribe({
          next: (data) => {
            const doctor = data as Doctor;
            Swal.fire('Created', 'Doctor created successfully', 'success');
            this.router.navigateByUrl(`/dashboard/doctor/${doctor._id}`);
          },
          error: () => {
            Swal.fire('Error', 'Something went wrong', 'error');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
