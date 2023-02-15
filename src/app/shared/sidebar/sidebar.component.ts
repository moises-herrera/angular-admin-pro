import { Component } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menu-item.model';
import { User } from 'src/app/interfaces/user.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent {
  public user: User;

  get menuItems(): MenuItem[] {
    return this.sidebarService.menu;
  }

  constructor(
    private sidebarService: SidebarService,
    private userService: UserService
  ) {
    this.user = this.userService.user;
  }
}
