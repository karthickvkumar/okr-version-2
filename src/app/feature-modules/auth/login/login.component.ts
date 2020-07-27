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
      this.router.navigateByUrl('/boards');
    }, (error) => {
      this.isLoading = false;
      console.error(error)
    })
  }

  gotoSignUp() {
    this.router.navigateByUrl('/signup');
  }
}
