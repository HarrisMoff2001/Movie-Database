import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { forkJoin } from 'rxjs';
import { Genre } from '../../models/genre.model';
import { MoviePreview } from '../../models/movie-preview.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-actor-movies-list',
  templateUrl: './actor-movies-list.component.html',
  styleUrls: ['./actor-movies-list.component.scss'],
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
export class ActorMoviesListComponent implements OnInit {

  @Input() actorMovies: MoviePreview[] = [];
  loading: boolean = true;
  actorMoviesByGenre: { genreName: string, movies: MoviePreview[] }[] = [];
  genres: Genre[] = [];

  //the lazyLoadEager is super important here as some actors have hundreds of movies
  //and being able to lazy load them is fantastic here
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

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const actorId = params.get('id');
      if (actorId) {
        this.fetchActorMoviesByGenre(actorId);
      }
    });
  }

  fetchActorMoviesByGenre(actorId: string) {
    this.loading = true;
    this.movieService.getAllGenres().subscribe(genres => {
      const genreRequests = genres.map(genre => this.movieService.getActorMovies(actorId));
      forkJoin(genreRequests).subscribe(responses => {
        const actorMoviesByGenre: { genreName: string, movies: MoviePreview[] }[] = [];
        genres.forEach((genre, index) => {
          const moviesForGenre = responses[index].filter(movie => movie.genre_ids.includes(genre.genre_ids));
          if (moviesForGenre.length > 0) {
            actorMoviesByGenre.push({ genreName: genre.name, movies: moviesForGenre });
          }
        });
        this.actorMoviesByGenre = actorMoviesByGenre;
        this.loading = false;
      });
    });
  }  
}