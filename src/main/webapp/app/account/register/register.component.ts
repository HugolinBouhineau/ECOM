import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';
import {LoginService} from "../../login/login.service";
import {Login} from "../../login/login.model";
import {StateStorageService} from "../../core/auth/state-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  redirectToPayment: boolean = false;

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });


  constructor(private translateService: TranslateService,
              private registerService: RegisterService,
              private ls: LoginService,
              private stateStorageService:StateStorageService,
              private router:Router) {}

  ngAfterViewInit(): void {
    console.log(this.stateStorageService.getUrl());
    if (this.stateStorageService.getUrl() === '/payment') {
      this.redirectToPayment = true;
    }
    this.stateStorageService.clearUrl();

    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      const { login, email } = this.registerForm.getRawValue();
      let rememberMe:boolean = false;
      let username: string = login;
      this.registerService
        .save({ login, email, password, langKey: this.translateService.currentLang })
        .subscribe({ next: () => {
          this.success = true
          this.ls.login({username, password, rememberMe}).subscribe({
            next: () => {
              console.log("haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
              if (!this.router.getCurrentNavigation()) {
                console.log("oraihzrtrou");
                // There were no routing during login (eg from navigationToStoredUrl)
                if (this.redirectToPayment) {
                  console.log("huh");
                  this.router.navigate(['/payment']);
                } else {
                  this.router.navigate(['']);
                }
              }
            }
          });
          },
          error: response => this.processError(response) });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
