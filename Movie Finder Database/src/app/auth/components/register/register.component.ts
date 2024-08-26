import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  loading = false;
  error: string | void = "";

  constructor(private authService: AuthService) { }

  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)])
  });

  async onSubmit() {
      this.loading = true;
      this.error = "";
      const {email, password} = this.registerForm.value;
      this.error = await this.authService.register(email!, password!);
      this.loading = false;
  }

  getEmailError(): string {
    if(this.registerForm.get('email')?.errors?.['email']) {
      return "Invalid email address";
    }
    if(this.registerForm.get('email')?.errors?.['required']) {
      return "Please provide email address";
    }
    return "An unknown error occured";
  }

  getPasswordError(): string {
    if(this.registerForm.get('password')?.errors?.['minlength']) {
      return "Password must be at least 6 characters";
    }
    if(this.registerForm.get('password')?.errors?.['required']) {
      return "Please provide a password";
    }
    return "An unknown error occured";
  }
}
