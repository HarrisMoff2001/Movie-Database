import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { PaginationService } from '../pageNum/services/pagination.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private auth: AngularFireAuth, 
    private authService: AuthService, 
    private paginationService: PaginationService, 
    private router: Router
  ) {}

      authenticated = false;
      authSubscription = new Subscription;

  ngOnInit(): void {
      this.auth.authState.subscribe(user => {
        this.authenticated = user ? true : false;
      });
  }

  onLogout(): void {
    this.authService.logout();
  }

  //so the pagination keeps resets it's page from the search results
  //back to the search page for trending as if not trending page count
  //will be what the search results were
  navigateSearch() {
    this.paginationService.resetPageNumber();
    this.router.navigate(['']);
  }


  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
