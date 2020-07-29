import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { ApiService } from "../../../core-services/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  validateForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private socialAuthService: AuthService, private apiService: ApiService) { }

  ngOnInit() {
    const userAuth = JSON.parse(localStorage.getItem('user'));
    if (userAuth && userAuth._id) {
      this.router.navigateByUrl('/boards');
    }
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitForm(): void {
    if (this.validateForm.status == "VALID") {
      this.isLoading = true;
      const userInfo = {
        username: this.validateForm.value.userName,
        email: this.validateForm.value.email,
        password: this.validateForm.value.password
      }
      this.apiService.signup(userInfo).subscribe((response: any) => {
        this.isLoading = false;
        if (response._id) {
          const userAuth = JSON.stringify(response);
          localStorage.setItem('user', userAuth);
          this.router.navigateByUrl('/boards');
        }
      }, (error) => {
        this.isLoading = false;
        this.apiService.notification();
      })
    }
  }

  public socialSignIn(socialPlatform: string) {
    this.isLoading = true;
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        const userInfo = {
          username: userData.name,
          email: userData.email,
          image: userData.image
        }
        this.apiService.signup(userInfo).subscribe((response) => {
          this.isLoading = false;
          const userAuth = JSON.stringify(response);
          localStorage.setItem('user', userAuth);
          this.router.navigateByUrl('/boards');
        }, (error) => {
          this.isLoading = false;
          this.apiService.notification();
        })
      }
    );
  }
}
