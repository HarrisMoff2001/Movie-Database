import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { ServiceProvider } from 'src/app/account/models/services.model';
import { SelectedServicesService } from './selected-services.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  userID!: string | null;
  services: ServiceProvider[] = [];
  services$ = new BehaviorSubject<ServiceProvider[]>([]);
  authToken: any;
  serviceConfirmed = false;

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private selectedServicesService: SelectedServicesService
  ) {
    this.auth.authState.subscribe(user => {
      this.userID = user ? user.uid : null;
      if(this.userID) {
        user?.getIdToken(false).then(token => {
          this.authToken = token;
          this.getServices();
        })
      } else {
        this.getServices();
      }
    });
  }

  getServices() {
    if (!this.userID) {
      this.services = [];
      this.services$.next(this.services.slice());
      return;
    }
    this.http.get<ServiceProvider[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/services/' + this.userID + '.json', {
      params: {
        'auth': this.authToken
      }
    }).subscribe(response => {
      if(response !== null) {
        this.serviceConfirmed = true;
        this.services = response;
        this.services$.next(this.services.slice());
        this.selectedServicesService.setSelectedServices(this.services);
      } else {
        this.serviceConfirmed = false;
      }
    });
  }

  storeService(service: ServiceProvider) {
    this.services.push(service);
    this.http.put<ServiceProvider[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/services/' + this.userID + '.json', this.services, {
      params: {
        'auth': this.authToken
      }
    }).subscribe();
    this.services$.next(this.services.slice());
  }

  removeService(service: ServiceProvider) {
    let i = this.services.map(f => f.id).indexOf(service.id);
    this.services.splice(i, 1);
    this.http.put<ServiceProvider[]>('https://assignment2-45537-default-rtdb.europe-west1.firebasedatabase.app/services/' + this.userID + '.json', this.services, {
      params: {
        'auth': this.authToken
      }
    }).subscribe();
    this.services$.next(this.services.slice());
  }
}
