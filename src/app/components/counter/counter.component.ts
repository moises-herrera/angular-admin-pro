import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styles: [],
})
export class CounterComponent implements OnInit {
  @Input('value') progress: number = 40;
  @Input() btnClass: string = 'btn-primary';
  @Output('value') valueChange: EventEmitter<number> =
    new EventEmitter<number>();

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  updateProgressPercentage(value: number): void {
    if (this.progress >= 100 && value >= 0) {
      this.valueChange.emit(100);
      this.progress = 100;
      return;
    }

    if (this.progress <= 0 && value < 0) {
      this.valueChange.emit(0);
      this.progress = 0;
      return;
    }

    this.progress += value;
    this.valueChange.emit(this.progress);
  }

  onChange(value: number): void {
    if (this.progress >= 100) {
      this.progress = 100;
    } else if (this.progress <= 0) {
      this.progress = 0;
    } else {
      this.progress = value;
    }
    this.valueChange.emit(this.progress);
  }
}
