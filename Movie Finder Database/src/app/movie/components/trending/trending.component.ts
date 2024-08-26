import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { PaginationService } from 'src/app/pageNum/services/pagination.service';
import { Genre } from '../../models/genre.model';
import { MoviePreview } from '../../models/movie-preview.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('void', style({
        'opacity': 0,
        'transform': 'translateX(-100%)'
      })),
      transition('void => *', [
        animate('.5s ease-in-out', style({
          'opacity': 1,
          'transform': 'translateX(0)'
        }))
      ]),
      transition('* => void', [
        animate('.5s ease-in-out', style({
          'opacity': 0,
          'transform': 'translateX(100%)'
        }))
      ])
    ])
  ]
})
export class TrendingComponent implements OnInit, OnDestroy {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    animateOut: true,
    navText: ['<span class="material-symbols-outlined">arrow_back_ios</span>', '<span class="material-symbols-outlined">arrow_forward_ios</span>'],
    navSpeed: 700,
    lazyLoadEager: 1,
    items: 3,
    margin: 16,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 1500,
    autoplayTimeout: 3000,
    autoplayMouseleaveTimeout: 500,
    responsive: {
      0: {
        items: 2,
        nav: false
      },
      380: {
        items: 2,
        nav: true
      },
      769: {
        items: 3,
        nav: true
      }
    },
    nav: false
  };

  private pageNumberSubscription!: Subscription;

  constructor(
    private movieService: MovieService,
    private paginationService: PaginationService,
    private router: Router
  ) { }

  trendingData: { genreName: string, movies: MoviePreview[] }[] = [];
  genres: Genre[] = [];
  loading = false;
  page: number = 1;
  totalPages: number = 0;

  navigateToMovieDetails(title: string, id: number) {
    this.paginationService.resetPageNumber();
    this.router.navigate(['../trending', title, id]);
  }

  ngOnInit() {
    this.pageNumberSubscription = this.paginationService.pageNumber$.subscribe((pageNumber: number) => {
      this.page = pageNumber;
      this.fetchTrendingMovies();
    });
  }

  fetchTrendingMovies() {
    this.loading = true;
    this.movieService.getAllGenres().subscribe(genres => {
      this.movieService.getTrending(this.page).subscribe(response => {
        const trendingData: { genreName: string, movies: MoviePreview[] }[] = [];     
        genres.forEach(genre => {
          const moviesWithGenre = response.movies.filter((movie) => movie.genre_ids.includes(genre.genre_ids));
          if (moviesWithGenre.length > 0) {
            trendingData.push({ genreName: genre.name, movies: moviesWithGenre });
          }
        });
        this.trendingData = trendingData;
        this.totalPages = response.totalPages;
        this.loading = false;
      });
    });
  }

  ngOnDestroy() {   
    if (this.pageNumberSubscription) {
      this.pageNumberSubscription.unsubscribe(); 
    } 
  }
}