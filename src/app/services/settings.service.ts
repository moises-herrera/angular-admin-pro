import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private linkTheme = document.querySelector('#theme');

  constructor() {
    this.setThemeSelected();
  }

  setThemeSelected(): void {
    const themeUrl =
      localStorage.getItem('theme') || './assets/css/colors/purple.css';

    if (this.linkTheme) {
      this.linkTheme.setAttribute('href', themeUrl);
    }
  }

  changeTheme(theme: string): void {
    const url = `./assets/css/colors/${theme}.css`;

    if (this.linkTheme) {
      this.linkTheme.setAttribute('href', url);
      localStorage.setItem('theme', url);
      this.checkCurrentTheme();
    }
  }

  checkCurrentTheme(): void {
    const links = document.querySelectorAll('.selector');
    links.forEach((element) => {
      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        element.classList.add('working');
      }
    })
  }
}
