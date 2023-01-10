import { Component } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styles: [],
})
export class ChartComponent {
  labels1: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  data1: number[] = [150, 850, 100];
}
