import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent {
  firstProgress: number = 25;
  secondProgress: number = 35;

  get getFirstProgress(): string {
    return `${this.firstProgress}%`;
  }

  get getSecondProgress(): string {
    return `${this.secondProgress}%`;
  }


}
