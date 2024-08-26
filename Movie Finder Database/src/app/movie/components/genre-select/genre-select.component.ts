import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from 'src/app/pageNum/services/pagination.service';
import { Genre } from '../../models/genre.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-genre-select',
  templateUrl: './genre-select.component.html',
  styleUrls: ['./genre-select.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ])
  ],
})
export class GenreSelectComponent implements OnInit {

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute, private paginationService: PaginationService) { }

  genres: Genre[] = [];
  loading = true;

  ngOnInit(): void {
    this.movieService.getAllGenres().subscribe(response => {
      this.genres = response;
      this.loading = false;
    });
  }

  onNavigateGenre(genre: string) {
    this.paginationService.resetPageNumber();
    this.router.navigate([genre], {relativeTo: this.route});
  }

}