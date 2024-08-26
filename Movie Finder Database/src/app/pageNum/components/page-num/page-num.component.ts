import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovieService } from 'src/app/movie/services/movie.service';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-page-num',
  templateUrl: './page-num.component.html',
  styleUrls: ['./page-num.component.scss'],
})
export class PageNumComponent implements OnInit, OnDestroy {
  pageNumber = 1;
  totalPages: number = 1;

  totalPagesSubscription!: Subscription;
  pageNumberSubscription!: Subscription;

  constructor(private paginationService: PaginationService, private movieService: MovieService) {}

  ngOnInit() {
    this.totalPagesSubscription = this.movieService.getTotalPages().subscribe((totalPages) => {
      //makes it so if there are 0 totalPages then it's set to 1 as you are still technically on a page...
      //it's just that page has no results on it
      this.totalPages = totalPages > 0 ? totalPages : 1;
    });

    this.pageNumberSubscription = this.paginationService.pageNumber$.subscribe((pageNumber: number) => {
      this.pageNumber = pageNumber;
    });
  }

  handlePrevClick() {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1;
      this.updatePageNumber();
    }
  }

  handleNextClick() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber += 1;
      this.updatePageNumber();
    }
  }

  updatePageNumber() {
    const totalPages = this.totalPages;
    this.paginationService.updatePageNumber(this.pageNumber, totalPages);
  }

  resetPageNumber() {
    this.paginationService.resetPageNumber();
  }

  ngOnDestroy(): void {
    if (this.totalPagesSubscription) {
      this.totalPagesSubscription.unsubscribe();
    }
    if (this.pageNumberSubscription) {
      this.pageNumberSubscription.unsubscribe();
    }
  }
}