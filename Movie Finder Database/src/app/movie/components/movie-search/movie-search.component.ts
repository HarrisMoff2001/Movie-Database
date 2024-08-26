import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from 'src/app/pageNum/services/pagination.service';
import { MoviePreview } from '../../models/movie-preview.model';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ]
})
export class MovieSearchComponent implements OnInit {

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private route: ActivatedRoute
  ) { }

  movies: MoviePreview[] = [];
  loading = false;
  page: number = 1;
  totalPages: number = 0;

  searchForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.updateLabel();
  }

  onSubmit() {
    const value = this.searchForm.controls['title'].value;
    this.paginationService.resetPageNumber();
    this.paginationService.updatePageNumber(1, 0);
    this.router.navigate(['../search/', value]);
    //sets the search value back to '' so if search is clicked again from the nav it brings
    // back the trending page as typically if someone clicks a nav button they're already on
    // it's to bring them back to the beginning of the page
    this.searchForm.controls['title'].setValue('');
  }

  hasActiveRoute(): boolean {
    return !!this.route.snapshot.children.length;
  }

  getLabel(): string {
    return this.getLabelText();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateLabel();
  }

  private getLabelText(): string {
    return window.innerWidth <= 350 ? 'Search' : 'Search for a Movie';
  }

  private updateLabel(): void {
    this.searchForm.controls['title'].setValidators(Validators.required);
    this.searchForm.controls['title'].updateValueAndValidity();
  }
}