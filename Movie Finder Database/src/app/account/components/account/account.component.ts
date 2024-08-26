import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceProvider } from '../../models/services.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
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
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ])
  ]
})
export class AccountComponent {

  services: ServiceProvider[] = [];
  loading = true;
  serviceSub = new Subscription;

  // Define properties for each checkbox
  netflixChecked: boolean = false;
  disneyChecked: boolean = false;
  amazonChecked: boolean = false;
  skyGoChecked: boolean = false;
  nowTvChecked: boolean = false;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.serviceSub = this.accountService.services$.subscribe(services => {
      this.services = services;
      this.loading = false;
      this.updateCheckboxValues();
    });
  }

  private updateCheckboxValues(): void {
    this.netflixChecked = this.isServiceChecked('Netflix');
    this.disneyChecked = this.isServiceChecked('Disney+');
    this.amazonChecked = this.isServiceChecked('Amazon Video');
    this.skyGoChecked = this.isServiceChecked('Sky Go');
    this.nowTvChecked = this.isServiceChecked('Now TV');
  }

  private isServiceChecked(serviceName: string): boolean {
    return this.services.some(service => service.name === serviceName);
  }

  ngOnDestroy(): void {
    this.serviceSub.unsubscribe();
  }

  toggleService(serviceName: string, checked: boolean, checkboxValue: string): void {
    const serviceInfo = this.getServiceInfo(serviceName, checkboxValue);
    if (checked) {
      this.addService(serviceInfo);
    } else {
      this.removeService(serviceInfo.id);
    }
  }

  private getServiceInfo(serviceName: string, checkboxValue: string): { id: string, name: string } {
    const serviceId = checkboxValue;
    return { id: serviceId, name: serviceName };
  }

  addService(serviceInfo: { id: string, name: string }): void {
    this.accountService.storeService(serviceInfo);
  }

  removeService(serviceId: string): void {
    this.accountService.removeService({
      id: serviceId,
      name: ''
    });
  }
}