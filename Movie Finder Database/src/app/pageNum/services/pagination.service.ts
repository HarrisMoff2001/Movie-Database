import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private pageNumberSubject = new BehaviorSubject<number>(1);
  pageNumber$ = this.pageNumberSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(0);
  totalPages$ = this.totalPagesSubject.asObservable();

  updatePageNumber(pageNumber: number, totalPages: number) {
    this.pageNumberSubject.next(pageNumber);
    this.totalPagesSubject.next(totalPages);
  }

  resetPageNumber() {
    this.pageNumberSubject.next(1);
  }
}