import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, first, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';

import { ModalService } from 'src/app/services/modal.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public from: number = 0;
  public isLoading: boolean = true;
  public searchTerm: string = '';

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.modalService.imageUploaded
      .pipe(delay(100), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService
      .loadUsers(this.from)
      .pipe(first())
      .subscribe(({ total, users }) => {
        this.totalUsers = total;
        this.users = users;
        this.usersTemp = users;
        this.isLoading = false;
      });
  }

  changePage(pageNumber: number): void {
    this.from += pageNumber;

    if (this.from < 0) {
      this.from = 0;
    } else if (this.from >= this.totalUsers) {
      this.from -= pageNumber;
    }

    this.loadUsers();
  }

  search(): void {
    if (this.searchTerm.trim().length === 0) {
      this.users = this.usersTemp;
      return;
    }
    this.searchService
      .search('users', this.searchTerm)
      .pipe(first())
      .subscribe((results) => {
        this.users = results as User[];
      });
  }

  deleteUser(user: User): void {
    if (user.uid === this.userService.user.uid) {
      Swal.fire('Error', 'You cannot delete yourself', 'error');
      return;
    }
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
        this.userService
          .deleteUser(user.uid || '')
          .pipe(first())
          .subscribe(() => {
            this.loadUsers();
            Swal.fire(
              'User deleted',
              `${user.name} was deleted successfully`,
              'success'
            );
          });
      }
    });
  }

  changeRole(user: User): void {
    this.userService.updateUser(user).pipe(first()).subscribe();
  }

  openModal(user: User): void {
    if (!user.uid) return;
    this.modalService.openModal('users', user.uid, user.img);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
