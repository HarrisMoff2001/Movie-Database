import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationService } from 'src/app/pageNum/services/pagination.service';
import { MoviePreview } from '../../models/movie-preview.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-by-genre',
  templateUrl: './movie-by-genre.component.html',
  styleUrls: ['./movie-by-genre.component.scss']
})
export class MovieByGenreComponent implements OnInit, OnDestroy {

  private pageNumberSubscription!: Subscription;

  constructor(private movieService: MovieService, private route: ActivatedRoute, private paginationService: PaginationService) {}

  loading = true;
  movies: MoviePreview[] = [];
  page: number = 1;
  totalPages: number = 0;

  ngOnInit(): void {
    this.pageNumberSubscription = this.paginationService.pageNumber$.subscribe((pageNumber: number) => {
      this.page = pageNumber;
      this.route.paramMap.subscribe(params => {
        this.loading = true;
        const genre = params.get('genre');
        this.fetchMovies(genre!);
      });
    });
  }

  fetchMovies(genre: string) {
    this.movieService.getMoviesByGenre(genre, this.page).subscribe(response => {
      this.movies = response.movies;
      this.totalPages = response.totalPages;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    if (this.pageNumberSubscription) {
      this.pageNumberSubscription.unsubscribe();
    }
  }
}