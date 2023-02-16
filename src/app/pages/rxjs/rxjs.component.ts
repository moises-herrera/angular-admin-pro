import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, interval, map, Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnInit, OnDestroy {
  public intervalSubs!: Subscription;

  constructor() {}

  ngOnInit(): void {
    // this.getCustomInterval()
    //   .pipe(retry(1))
    //   .subscribe({
    //     next: (value) => console.log(value),
    //     error: (err) => console.warn(err),
    //     complete: () => console.info('Completed'),
    //   });

    // this.intervalSubs = this.getInterval().subscribe(console.log);
  }

  getInterval(): Observable<number> {
    return interval(100).pipe(
      take(10),
      map((value) => value + 1),
      filter((value) => value % 2 === 0)
    );
  }

  getCustomInterval(): Observable<number> {
    let counter = -1;

    const obs$ = new Observable<number>((observer) => {
      const interval = setInterval(() => {
        counter++;
        observer.next(counter);

        if (counter === 4) {
          clearInterval(interval);
          observer.complete();
        }

        if (counter === 2) {
          counter = 0;
          observer.error('Something went wrong');
        }
      }, 1000);
    });

    return obs$;
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }
}
