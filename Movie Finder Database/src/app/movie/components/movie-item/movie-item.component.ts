import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviePreview } from '../../models/movie-preview.model';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('*', style({ 
        'opacity': 1,
        'transform': 'scale(1)'
      })),
      transition('void => *', [
        style({
          'opacity': 0,
          'transform': 'scale(0)'
        }),
        animate('.5s ease-in')
      ])
    ])
  ]
})
export class MovieItemComponent {

  @Input() movie!: MoviePreview;

  constructor(private router: Router, private route: ActivatedRoute) { }

  onViewMovie() {
    this.router.navigate([this.movie.id], {relativeTo: this.route});
  }
}
