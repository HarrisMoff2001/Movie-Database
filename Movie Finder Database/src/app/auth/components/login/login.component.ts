import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  loading = false;
  error: string | void = "";

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)])
  });

  async onSubmit() {
    this.loading = true;
    this.error = "";
    const {email, password} = this.loginForm.value;
    this.error = await this.authService.login(email!, password!);
    this.loading = false;
  }

  getEmailError(): string {
    if(this.loginForm.get('email')?.errors?.['email']) {
      return "Invalid email address";
    }
    if(this.loginForm.get('email')?.errors?.['required']) {
      return "Please provide email address";
    }
    return "An unknown error occured";
  }
}