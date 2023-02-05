import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { Hospital } from 'src/app/models/hospital.model';
import { User } from 'src/app/models/user.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [],
})
export class SearchComponent implements OnInit {
  private destroyed$ = new Subject<void>();

  public users: User[] = [];
  public doctors: Doctor[] = [];
  public hospitals: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchGlobal();
  }

  searchGlobal(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ term }) => this.searchService.searchGlobal(term)),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ users, doctors, hospitals }: any) => {
        this.users = users;
        this.doctors = doctors;
        this.hospitals = hospitals;
      });
  }
}
