import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceProvider } from 'src/app/account/models/services.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedServicesService {
  private selectedServicesSubject = new BehaviorSubject<ServiceProvider[]>([]);
  selectedServices$ = this.selectedServicesSubject.asObservable();

  setSelectedServices(services: ServiceProvider[]): void {
    this.selectedServicesSubject.next(services);
  }
}