import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LayoutModule } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { environment } from '../environments/environment';
import { AccountComponent } from './account/components/account/account.component';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { firebaseConfig } from './auth/models/firebase.model';
import { ActorMoviesListComponent } from './movie/components/actor-movies-list/actor-movies-list.component';
import { GenreSelectComponent } from './movie/components/genre-select/genre-select.component';
import { MovieByGenreComponent } from './movie/components/movie-by-genre/movie-by-genre.component';
import { MovieDetailsComponent } from './movie/components/movie-details/movie-details.component';
import { MovieItemComponent } from './movie/components/movie-item/movie-item.component';
import { MovieListComponent } from './movie/components/movie-list/movie-list.component';
import { MovieSearchComponent } from './movie/components/movie-search/movie-search.component';
import { SearchResultsComponent } from './movie/components/search-results/search-results.component';
import { TrendingComponent } from './movie/components/trending/trending.component';
import { NavComponent } from './nav/nav.component';
import { PageNumComponent } from './pageNum/components/page-num/page-num.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { WatchListsComponent } from './watchList/components/watch-list/watch-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AccountComponent,
    MovieSearchComponent,
    WatchListsComponent,
    NotFoundComponent,
    MovieListComponent,
    MovieItemComponent,
    LoadingSpinnerComponent,
    GenreSelectComponent,
    SearchResultsComponent,
    MovieDetailsComponent,
    MovieByGenreComponent,
    LoginComponent,
    RegisterComponent,
    PageNumComponent,
    TrendingComponent,
    ActorMoviesListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    CarouselModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
