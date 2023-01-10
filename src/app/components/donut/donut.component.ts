import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [],
})
export class DonutComponent implements OnInit {
  @Input() title: string = 'Untitled';
  @Input() labels: string[] = ['Label1', 'Label2', 'Label3'];
  @Input() data: number[] = [350, 150, 100];

  public doughnutChartData!: ChartData<'doughnut'>;

  ngOnInit(): void {
    this.doughnutChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: ['#F59E5E', '#FFB700', '#E8E107'],
        },
      ],
    };
  }
}
