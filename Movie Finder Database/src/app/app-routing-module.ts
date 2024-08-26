import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./account/components/account/account.component";
import { LoginComponent } from "./auth/components/login/login.component";
import { RegisterComponent } from "./auth/components/register/register.component";
import { AuthGuardLoginService } from "./auth/services/auth-guard-login.service";
import { AuthGuardService } from "./auth/services/auth-guard.service";
import { ActorMoviesListComponent } from "./movie/components/actor-movies-list/actor-movies-list.component";
import { GenreSelectComponent } from "./movie/components/genre-select/genre-select.component";
import { MovieByGenreComponent } from "./movie/components/movie-by-genre/movie-by-genre.component";
import { MovieDetailsComponent } from "./movie/components/movie-details/movie-details.component";
import { MovieSearchComponent } from "./movie/components/movie-search/movie-search.component";
import { SearchResultsComponent } from "./movie/components/search-results/search-results.component";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { WatchListsComponent } from "./watchList/components/watch-list/watch-list.component";

const routes: Routes = [
    {path: '', component: MovieSearchComponent, children: [
        {path: 'search/:title', component: SearchResultsComponent},
        {path: 'search/:title/:id', component: MovieDetailsComponent}
    ]},
    {path: 'genre', component: GenreSelectComponent, children: [
        {path: ':genre', component: MovieByGenreComponent},
        {path: ':genre/:id', component: MovieDetailsComponent}
    ]},
    {path: 'watch-list', component: WatchListsComponent, canActivate: [AuthGuardService]},
    {path: 'watch-list/:id', component: MovieDetailsComponent, canActivate: [AuthGuardService]},
    {path: 'account', component: AccountComponent, canActivate: [AuthGuardService]},
    {path: 'login', component: LoginComponent, canActivate: [AuthGuardLoginService]},
    {path: 'register', component: RegisterComponent},
    {path: '', component: MovieSearchComponent, children: [
        { path: ':id', component: MovieDetailsComponent }
    ]},
    //i couldn't figure out the children pathing here, I feel like that would be better but it was quite fidgity
    { path: 'actor/:id/actor-movies', component: ActorMoviesListComponent },
    { path: 'actor/:id/actor-movies/:id', component: MovieDetailsComponent },
    {path: '**', component: NotFoundComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}