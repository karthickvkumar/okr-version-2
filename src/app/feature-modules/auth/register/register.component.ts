import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private socialAuthService: AuthService, private apiService: ApiService) { }

  ngOnInit() {
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
        image: this.validateForm.value.password
      }
      this.apiService.signup(userInfo).subscribe((response) => {
        this.isLoading = false;
        console.log(response)
      }, (error) => {
        console.error(error)
      })
    }
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }


    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.isLoading = true;
        const userInfo = {
          username: userData.name,
          email: userData.email,
          image: userData.image
        }
        this.apiService.signup(userInfo).subscribe((response) => {
          this.isLoading = false;
          console.log(response)
        }, (error) => {
          console.error(error)
        })
      }
    );
  }
}
