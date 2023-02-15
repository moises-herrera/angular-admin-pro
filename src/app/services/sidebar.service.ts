import { Injectable } from '@angular/core';
import { MenuItem } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public menu: MenuItem[] = [];

  constructor() {}

  loadMenu(): void {
    const menuStored = localStorage.getItem('menu');
    if (!menuStored) return;
    this.menu = JSON.parse(menuStored);
  }
}
