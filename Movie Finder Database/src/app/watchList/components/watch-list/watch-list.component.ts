import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoviePreview } from 'src/app/movie/models/movie-preview.model';
import { WatchListsService } from '../../services/watch-list.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss'],
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
export class WatchListsComponent implements OnInit, OnDestroy {

  constructor(private watchlistService: WatchListsService) { }

  watchlists: MoviePreview[] = [];
  loading = true;
  watchlistSub = new Subscription;

  ngOnInit(): void {
    this.watchlistSub = this.watchlistService.watchlists$.subscribe(watchlists => {
      this.watchlists = watchlists;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.watchlistSub.unsubscribe();
  }

}