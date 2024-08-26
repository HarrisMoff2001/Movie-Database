import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { MoviePreview } from 'src/app/movie/models/movie-preview.model';

@Injectable({
  providedIn: 'root'
})
export class WatchListsService {

  userID!: string | null;
  watchlists: MoviePreview[] = [];
  watchlists$ = new BehaviorSubject<MoviePreview[]>([]);
  authToken: any;

  constructor(private http: HttpClient, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      this.userID = user ? user.uid : null;
      if(this.userID) {
        user?.getIdToken(false).then(token => {
          this.authToken = token;
          this.getWatchLists();
        })
      } else {
        this.getWatchLists();
      }
    });
  }

  getWatchLists() {
    if(!this.userID) {
      this.watchlists = [];
      this.watchlists$.next(this.watchlists.slice());
      return;
    }
    this.http.get<MoviePreview[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/watchlist/' + this.userID + '.json', {
      params: {
        'auth': this.authToken
      }
    }).subscribe(response => {
      if(response) {
        this.watchlists = response;
        this.watchlists$.next(this.watchlists.slice());
      }
    });
  }

  storeWatchLists(movie: MoviePreview) {
    this.watchlists.push(movie);
    this.http.put<MoviePreview[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/watchlist/' + this.userID + '.json', this.watchlists, {
      params: {
        'auth': this.authToken
      }
    }).subscribe();
    this.watchlists$.next(this.watchlists.slice());
  }

  removeWatchList(movie: MoviePreview) {
    let i = this.watchlists.map(f => f.id).indexOf(movie.id);
    this.watchlists.splice(i, 1);
    this.http.put<MoviePreview[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/watchlist/' + this.userID + '.json', this.watchlists, {
      params: {
        'auth': this.authToken
      }
    }).subscribe();
    this.watchlists$.next(this.watchlists.slice());
  }
}