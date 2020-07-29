import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from "../../../core-services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    const userAuth = JSON.parse(localStorage.getItem('user'));
    if (userAuth && userAuth._id) {
      this.router.navigateByUrl('/boards');
    }
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submitForm(): void {
    const userInfo = {
      email: this.validateForm.value.userName,
      password: this.validateForm.value.password
    }

    this.isLoading = true;
    this.apiService.login(userInfo).subscribe((response) => {
      this.isLoading = false;
      const userAuth = JSON.stringify(response);
      localStorage.setItem('user', userAuth);
      this.router.navigateByUrl('/boards');
    }, (error) => {
      this.isLoading = false;
      this.apiService.notification();
    })
  }

  gotoSignUp() {
    this.router.navigateByUrl('/signup');
  }
}
