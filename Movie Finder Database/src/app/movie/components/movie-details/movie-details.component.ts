import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SelectedServicesService } from 'src/app/account/services/selected-services.service';
import { WatchListsService } from 'src/app/watchList/services/watch-list.service';
import { MoviePreview } from '../../models/movie-preview.model';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
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
      ])
    ]),
    trigger('enlarge', [
      transition('* => enlarged', [
        style({ transform: 'scale(1)' }),
        animate('0.5s', style({ transform: 'scale(1.2)' }))
      ]),
      transition('enlarged => *', [
        animate('0.5s', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class MovieDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location,
    private auth: AngularFireAuth,
    private watchlistService: WatchListsService,
    private selectedServices: SelectedServicesService,
    private router: Router
  ) { }

  movie$!: Observable<Movie>;
  authenticated = false;
  authSub = new Subscription;
  isWatchList = false;
  watchlistSub = new Subscription;
  serviceConfirmedSub = new Subscription;
  serviceConfirmed: any[] = [];
  serviceConfirmedLength: number = 0;

  actorMovies: MoviePreview[] = [];
  subscriptions: Subscription[] = [];

  buttonState: string = 'normal';
  
  ngOnInit(): void {
    this.serviceConfirmedSub = this.selectedServices.selectedServices$.subscribe(res => {
      this.serviceConfirmed = res;
      this.serviceConfirmedLength = res.length;
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.fetchMovie(id!);
    });
    this.authSub = this.auth.authState.subscribe(user => {
      this.authenticated = user ? true : false;
    });
  }

  fetchMovie(id: string) {
    this.movie$ = this.movieService.getMovieDetails(id);
    this.watchlistSub = this.watchlistService.watchlists$.subscribe(watchlists => {
      this.isWatchList = watchlists.map(f => String(f.id)).indexOf(id) !== -1;
    });
  }

  onWatchListAction(movie: Movie) {
    if (this.isWatchList) {
      this.onRemoveWatchList(movie);
    } else {
      this.onAddWatchList(movie);
    }
  }

  onAddWatchList(movie: Movie) {
    const limitedMovie = new MoviePreview(movie.id, movie.name, movie.imgURL, movie.genre_ids);
    this.watchlistService.storeWatchLists(limitedMovie);
    this.buttonState = 'enlarged';
    setTimeout(() => {
    this.buttonState = 'normal';
    }, 200);
  }

  onRemoveWatchList(movie: Movie) {
    const limitedMovie = new MoviePreview(movie.id, movie.name, movie.imgURL, movie.genre_ids);
    this.watchlistService.removeWatchList(limitedMovie);
    this.buttonState = 'enlarged';
    setTimeout(() => {
    this.buttonState = 'normal';
    }, 200);
  }

  onBack() {
    this.location.back();
  }

  onActorCardClicked(actorId: string) {
    this.router.navigate(['actor', actorId, 'actor-movies']);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.watchlistSub.unsubscribe();
    this.serviceConfirmedSub.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}