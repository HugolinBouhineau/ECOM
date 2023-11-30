import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from '../core/auth/state-storage.service';
import { AlertService } from '../core/util/alert.service';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  redirectToPayment = false;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private stateStorageService: StateStorageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.stateStorageService.getUrl() === '/payment') {
      this.alertService.addAlert({ type: 'info', message: 'Veuillez vous connecter avant de passer au payement' });
      this.redirectToPayment = true;
    }
    this.stateStorageService.clearUrl();
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError = false;
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          if (this.redirectToPayment) {
            this.router.navigate(['/payment']);
          } else {
            this.router.navigate(['']);
          }
        }
      },
      error: () => (this.authenticationError = true),
    });
  }

  register(): void {
    if (this.redirectToPayment) {
      this.stateStorageService.storeUrl('/payment');
    }
    this.router.navigate(['/account/register']);
  }
}
