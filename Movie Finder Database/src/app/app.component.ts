import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Assignment_2';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getServices();
  }
}
