import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  public user: User;

  constructor(private userService: UserService, private router: Router) {
    this.user = this.userService.user;
  }

  logout(): void {
    this.userService.logout();
  }

  search(term: string): void {
    if (term.trim().length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/search/${term}`);
  }
}
