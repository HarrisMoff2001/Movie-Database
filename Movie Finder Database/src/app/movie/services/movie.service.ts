import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, concatMap, forkJoin, map, of, switchMap, tap, timer } from 'rxjs';
import { ServiceProvider } from 'src/app/account/models/services.model';
import { SelectedServicesService } from 'src/app/account/services/selected-services.service';
import { Genre } from '../models/genre.model';
import { MoviePreview } from '../models/movie-preview.model';
import { Movie } from '../models/movie.model';

interface movieAPIResponse {
  page: number;
  results: {
    id: string,
    title: string,
    poster_path: string,
    genre_ids: string,
  } [];
  total_results: number;
}

interface movieReviewAPIResponse {
  id: string;
  results: {
    content: string;
    author_details: {
      username: string;
      rating: number;
    };
  }[];
}

interface servicesAPIResponse {
  id: string;
  results: {
    GB: string;
    flatrate: {
      logo_path: string;
      provider_id: string;
      provider_name: string;
    }
  } [];
}

interface movieAgeRatingAPIResponse {
  id: string;
  results: {
    iso_3166_1: 'GB';
    release_dates: {
      certification: string
    }
  } [];
}

interface movieDetailAPIResponse {
  id: string;
  title: string;
  poster_path: string;
  genres: { id: string, name: string }[];
  overview: string;
  tagline: string;
  release_date: string;
  status: string;
  homepage: string;
  budget: number;
  revenue: number;
  runtime: string;
  production_companies: {name: string}[];
  spoken_languages: {english_name: string}[];
}

interface genreAPIResponse {
  genres: {
    id: string,
    name: string
  } [];
};

interface movieTrailerAPIResponse {
  results: {
    key: string;
    type: string;
    official: boolean;
  } [];
}

interface trailerChannelAPIResponse {
  items: {
    snippet: {
      title: string;
      channelTitle: string;
    }
  } []; 
}

interface castAPIResponse {
  cast: {
    id: string;
    gender: string;
    name: string;
    profile_path: string;
    character: string;
  } [];
}

interface actorsMoviesAPIResponse {
  cast: {
    id: string;
    title: string;
    poster_path: string;
    genre_ids: string
  } [];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient, private selectedServicesService: SelectedServicesService, private decimalPipe: DecimalPipe) { 
    this.selectedServicesService.selectedServices$.subscribe((services: ServiceProvider[]) => {
      this.selectedServices = services;
    });
  }

  private totalPagesSubject = new Subject<number>();
  private selectedServices: ServiceProvider[] = [];

  setSelectedServices(services: ServiceProvider[]): void {
    this.selectedServices = services;
  }

  getMoviesByTitle(title: string, page: number) {
    return this.http.get<movieAPIResponse>('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: 'd311d8fe4064b146b955363542a543a8',
          query: title,
          page: page
        },
      }).pipe(map((response) => {
        if (!response.results) {
          return { movies: [], totalPages: 1 };
        }
        const totalPages = Math.ceil(response.total_results / 20);
        this.totalPagesSubject.next(totalPages);

        //slice is commented out here as I realised this means I'm essentially deleting two movies per page and I tried adding them back
        //on the next page but then when going back pages it became very complex and confusing so I opted to increasing the rows to 4 from 3 
        //and removing the title text at 1000px screens instead of 768px which is not ideal to me as I wanted the movies to be 3 rows by 6
        //but I will have to suck it up and go with 4 rows by 5 as there is no way to get any less or more than 20 results from the API for a
        //given request
        const movies = response.results/*.slice(0, 18)*/.map((movie) => {
          if (movie.poster_path === null) {
            movie.poster_path = '../../../assets/no-poster-available.jpg';
          } else {
            movie.poster_path = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
          }
          return new MoviePreview(movie.id, movie.title, movie.poster_path, movie.genre_ids);
        });
        return { movies, totalPages };
      }));
  }

  getMoviesByGenre(genre_ids: string, page: number) {
    return this.http.get<movieAPIResponse>('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8',
        with_genres: genre_ids,
        page: page
      }
    }).pipe(
      map((response) => {
        if (!response.results) {
          return { movies: [], totalPages: 1 };
        }
        const totalPages = Math.ceil(response.total_results / 20);
        this.totalPagesSubject.next(totalPages);

        const movies = response.results.map((movie) => {
          if (movie.poster_path === null) {
            //if there is no poster_path from the API response, it is set to the no poster available image
            movie.poster_path = '../../../assets/no-poster-available.jpg';
          } else {
            //completes the URL from the API response
            movie.poster_path = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
          }
          return new MoviePreview(movie.id, movie.title, movie.poster_path, movie.genre_ids);
        });
        return { movies, totalPages };
      })
    );
  }

  getMovieDetails(movieId: string): Observable<Movie> {
    return this.selectedServicesService.selectedServices$.pipe(
      concatMap(() => {
    const movieDetails$ = this.http.get<movieDetailAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map(response => {
        const genreNames: string[] = response.genres.map(genre => genre.name);
        const productionNames: string[] = response.production_companies.map(production_companies => production_companies.name);
        const spokenLanguages: string[] = response.spoken_languages.map(spoken_languages => spoken_languages.english_name);

        if (response.poster_path === null) {
          //if there is no poster_path from the API response, it is set to the no poster available image
          response.poster_path = '../../../assets/no-poster-available.jpg';
        } else {
          //completes the URL from the API response
          response.poster_path = 'https://image.tmdb.org/t/p/original' + response.poster_path;
        }

        //uses the built in decimalPipe from angular to make the numerical values more readable
        const budget = this.decimalPipe.transform(response.budget, '1.0-0') || '';
        const revenue = this.decimalPipe.transform(response.revenue, '1.0-0') || '';

        const profit = response.revenue - response.budget;
        const Profit = this.decimalPipe.transform(profit, '1.0-0') || '';


        const movieDetails = new Movie(
          response.id,
          response.title,
          response.poster_path,
          response.id,
          genreNames,
          response.overview,
          response.tagline,
          response.release_date,
          response.status,
          response.homepage,
          budget,
          revenue,
          response.runtime,
          Profit,
          productionNames,
          spokenLanguages
        );
        return movieDetails;
      })
    );

    const movieReviews$ = this.http.get<movieReviewAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/reviews`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map(response => {
        const reviews = response.results.map(review => ({
          username: review.author_details.username,
          rating: review.author_details.rating,
          content: review.content
        }));

        // Filters out reviews without a rating to calculate the average rating without outliers
        const validRatings = response.results.filter(review => review.author_details.rating !== null);
        const totalRating = validRatings.reduce((sum, review) => sum + review.author_details.rating, 0);
        const averageRating = parseFloat((validRatings.length === 0 ? 0 : totalRating / validRatings.length).toFixed(1));

        return { reviews, averageRating };
      })
    );

    const movieAgeRating$ = this.http.get<movieAgeRatingAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/release_dates`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map(response => {
        const gbRelease = response.results.find(result => result.iso_3166_1 === 'GB');

        if (gbRelease && Array.isArray(gbRelease.release_dates) && gbRelease.release_dates.length > 0) {
          return gbRelease.release_dates[0].certification;
        }
        return null;
      })
    );

    const movieTrailer$ = this.http.get<movieTrailerAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      switchMap(response => {
        //gets the trailer key and official boolean from the TMDB API and sets the value of trailer based on if there is a official trailer or not
        //if there is then it will get the first trailer that is official, if there is none then it will get the first unofficial trailer.
        let trailer = response.results.find(result => result.type === 'Trailer' && result.official === true);
        if (!trailer) {
          trailer = response.results.find(result => result.type === 'Trailer' && result.official === false);
        }
        
        if (trailer) {
          //uses the youtube api to get the channel name and exact trailer title by passing the key from the TMDB API
          const trailerURL = 'https://www.youtube.com/watch?v=' + trailer.key;
          return this.http.get<trailerChannelAPIResponse>(`https://youtube.googleapis.com/youtube/v3/videos`, {
            params: {
              part: 'snippet',
              id: trailer.key,
              key: 'AIzaSyCdgj9b7eJ2MBZemLyvgu2dovkZ7a9gOjk'
            }
          }).pipe(
            map(response => {
              if (response && response.items.length > 0) {
                const channel = response.items[0];
                const channelName = channel?.snippet?.channelTitle || '';
                const trailerTitle = channel?.snippet?.title || '';
                return { trailerTitle, channelName, trailerURL };
              } else {
                return null;
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );

    const movieProviders$ = this.http.get<servicesAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map((response) => {
        const flatrateItems = (response.results as any)['GB']?.flatrate || [];
        const extractedItems = flatrateItems.map((item: any) => ({
          logo_path: 'https://image.tmdb.org/t/p/original' + item.logo_path,
          provider_id: item.provider_id,
          provider_name: item.provider_name
        }));
        const matchedProviders = this.compareServicesWithMovieProviders(extractedItems);
        return matchedProviders;
      })
    );

    const movieCast$ = this.http.get<castAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
      params: {
          api_key: 'd311d8fe4064b146b955363542a543a8'
      }
      }).pipe(
          map(response => {
            const cast = response.cast.map(cast => {
              let gender: string;
              const genderValue = String(cast.gender);
              if (genderValue === '0') {
                  gender = 'Unknown';
              } else if (genderValue === '1') {
                  gender = 'Female';
              } else if (genderValue === '2') {
                  gender = 'Male';
              } else {
                  gender = 'Unknown';
              }
              return {
                  id: cast.id,
                  gender: gender,
                  name: cast.name,
                  profile_path: cast.profile_path,
                  character: cast.character,
              };
            });
        return { cast };
      })
    );
    return forkJoin({
      movieDetails: movieDetails$,
      movieReviews: movieReviews$,
      movieCast: movieCast$,
      movieAgeRating: movieAgeRating$,
      movieTrailer: movieTrailer$,
      movieProviders: movieProviders$
    }).pipe(
      map(({ movieDetails, movieReviews, movieCast, movieAgeRating, movieTrailer, movieProviders }) => {
        movieDetails.reviews = movieReviews.reviews;
        movieDetails.cast = movieCast.cast;
        movieDetails.averageRating = movieReviews.averageRating;
        movieDetails.certification = movieAgeRating;
        movieDetails.trailer = movieTrailer;
        movieDetails.providers = movieProviders;
        return movieDetails;
      }));
   })
  );
}

  compareServicesWithMovieProviders(movieProviders: any[]): any[] {
    const selectedServices = this.selectedServices;
    const matchingProviders = selectedServices.map(selectedService => {
      const match = movieProviders.find(provider => provider.provider_id.toString() === selectedService.id);
      if (match) {
        return {
          provider_id: match.provider_id,
          provider_name: match.provider_name,
          logo_path: match.logo_path
        };
      } else {
        return null;
      }
    }).filter(match => match !== null); 
    return matchingProviders;
  }

  getAllGenres() {
    return this.http.get<genreAPIResponse>('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8',
      }
    }).pipe(
      map((response) => {
        return response.genres.map((genre) => {
          return new Genre(genre.id, genre.name);
        });
      })
    )
  }

  getTrending(page: number) {
    return this.http.get<movieAPIResponse>('https://api.themoviedb.org/3/trending/movie/day', {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8',
        page: page
      }
    }).pipe(
      map((response) => {
        if (!response.results) {
          return { movies: [], totalPages: 1 };
        }
        const totalPages = Math.ceil(response.total_results / 20);
        this.totalPagesSubject.next(totalPages);

        const movies = response.results.map((movie) => {
          if (movie.poster_path === null) {
            movie.poster_path = '../../../assets/no-poster-available.jpg';
          } else {
            movie.poster_path = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
          }
          return new MoviePreview(movie.id, movie.title, movie.poster_path, movie.genre_ids);
        });
        return { movies, totalPages };
      })
    );
  }  

  getServiceProviders(movieId: string) {
    return this.http.get<servicesAPIResponse>(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map((response) => {
        const flatrateItems = (response.results as any)['GB']?.flatrate || [];
        const extractedItems = flatrateItems.map((item: any) => ({
          logo_path: item.logo_path,
          provider_id: item.provider_id,
          provider_name: item.provider_name
        }));
        return extractedItems;
      })
    );
  }

  getActorMovies(actorId: string): Observable<MoviePreview[]> {
    return this.http.get<actorsMoviesAPIResponse>(`https://api.themoviedb.org/3/person/${actorId}/movie_credits`, {
      params: {
        api_key: 'd311d8fe4064b146b955363542a543a8'
      }
    }).pipe(
      map(response => {
        const movies = response.cast.map((movie: any) => {
          if (movie.poster_path === null) {
            movie.poster_path = '../../../assets/no-poster-available.jpg';
          } else {
            movie.poster_path = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
          }
          return new MoviePreview(movie.id, movie.title, movie.poster_path, movie.genre_ids);
        });
        return movies;
      })
    );
  }
  

  getTotalPages(): Observable<number> {
    return this.totalPagesSubject.asObservable();
  }
}