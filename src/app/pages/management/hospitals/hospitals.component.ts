import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, first, Subject, takeUntil } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalService } from 'src/app/services/modal.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [],
})
export class HospitalsComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  public hospitals: Hospital[] = [];
  public hospitalsTemp: Hospital[] = [];
  public isLoading: boolean = false;
  public searchTerm: string = '';

  constructor(
    private hospitalService: HospitalService,
    private modalService: ModalService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadHospitals();
    this.modalService.imageUploaded
      .pipe(delay(100), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loadHospitals();
      });
  }

  loadHospitals(): void {
    this.isLoading = true;
    this.hospitalService
      .loadHospitals()
      .pipe(first())
      .subscribe((hospitals) => {
        this.isLoading = false;
        this.hospitals = hospitals;
        this.hospitalsTemp = hospitals;
      });
  }

  search(): void {
    if (this.searchTerm.trim().length === 0) {
      this.hospitals = this.hospitalsTemp;
      return;
    }
    this.searchService
      .search('hospitals', this.searchTerm)
      .pipe(first())
      .subscribe((results) => {
        this.hospitals = results;
      });
  }

  saveChanges(hospital: Hospital) {
    if (!hospital._id) return;

    this.hospitalService
      .updateHospital(hospital._id, hospital.name)
      .pipe(first())
      .subscribe({
        next: () => {
          Swal.fire('Updated', hospital.name, 'success');
        },
        error: () => {
          Swal.fire('Error', 'Something went wrong', 'error');
        },
      });
  }

  deleteHospital(hospital: Hospital) {
    if (!hospital._id) return;

    this.hospitalService
      .deleteHospital(hospital._id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loadHospitals();
          Swal.fire('Deleted', hospital.name, 'success');
        },
        error: () => {
          Swal.fire('Error', 'Something went wrong', 'error');
        },
      });
  }

  async openModalCreateHospital(): Promise<void> {
    const { value } = await Swal.fire<string>({
      title: 'Create Hospital',
      input: 'text',
      inputPlaceholder: 'Hospital name',
      showCancelButton: true,
    });

    if (value && value?.trim().length > 0) {
      this.hospitalService
        .createHospital(value)
        .pipe(first())
        .subscribe({
          next: ({ hospital }: any) => {
            this.hospitals.push(hospital);
          },
          error: () => {
            Swal.fire('Error', 'Something went wrong', 'error');
          },
        });
    }
  }

  openImageModal(hospital: Hospital): void {
    if (!hospital._id) return;
    this.modalService.openModal('hospitals', hospital._id, hospital.img);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
