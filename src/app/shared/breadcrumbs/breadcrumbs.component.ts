import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { filter, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnDestroy {
  public title: string = '';
  public titleSubs$: Subscription;

  constructor(private router: Router) {
    this.titleSubs$ = this.getRouteData().subscribe(({ title }: Data) => {
      this.title = title as string;
      document.title = `AdminPro - ${this.title}`;
    });
  }

  getRouteData(): Observable<Data> {
    return this.router.events.pipe(
      filter(
        (event) =>
          event instanceof ActivationEnd && event.snapshot.firstChild === null
      ),
      map((event) => (event as ActivationEnd).snapshot.data)
    );
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }
}
