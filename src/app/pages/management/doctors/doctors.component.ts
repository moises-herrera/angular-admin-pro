import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, first, Subject, takeUntil } from 'rxjs';
import { Doctor } from 'src/app/models';
import { DoctorService } from 'src/app/services/doctor.service';
import { ModalService } from 'src/app/services/modal.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [],
})
export class DoctorsComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  public doctors: Doctor[] = [];
  public doctorsTemp: Doctor[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';

  constructor(
    private doctorService: DoctorService,
    private modalService: ModalService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.modalService.imageUploaded
      .pipe(delay(100), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loadDoctors();
      });
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService
      .loadDoctors()
      .pipe(first())
      .subscribe((doctors) => {
        this.isLoading = false;
        this.doctors = doctors;
        this.doctorsTemp = doctors;
      });
  }

  search(): void {
    if (this.searchTerm.trim().length === 0) {
      this.doctors = this.doctorsTemp;
      return;
    }
    this.searchService
      .search('doctors', this.searchTerm)
      .pipe(first())
      .subscribe((results) => {
        this.doctors = results;
      });
  }

  deleteDoctor(doctor: Doctor) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!doctor._id) return;
        this.doctorService
          .deleteDoctor(doctor._id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.loadDoctors();
              Swal.fire('Deleted', doctor.name, 'success');
            },
            error: () => {
              Swal.fire('Error', 'Something went wrong', 'error');
            },
          });
      }
    });
  }

  openImageModal(doctor: Doctor): void {
    if (!doctor._id) return;
    this.modalService.openModal('doctors', doctor._id, doctor.img);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
