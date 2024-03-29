import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService} from 'src/app/Services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { }
  username: string;
  password: string;
  chosenSignupForm = 0 ;
  signupForm: FormGroup;
  isSubmitted  =  false;
  captchaResponse: string;

  ngOnInit() {
    this.signupForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      age: [0, Validators.required],
      town: ['', Validators.required]
     }, {
      validator: this.MustMatch('password', 'confirmedPassword')
    });
  }

  chooseForm(index: number) {
    this.chosenSignupForm = index;
  }

  isFieldInvalid(field: string) { // {6}
  return (
    (!this.signupForm.get(field).valid && this.signupForm.get(field).touched) ||
    (this.signupForm.get(field).untouched && this.isSubmitted)
  );
   }

   isFormValid(form: FormGroup): boolean {
     return( !this.isFieldInvalid('username') && !this.isFieldInvalid('password')
              && this.signupForm.get('username').valid && this.signupForm.get('password').valid);
   }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.captchaResponse = captchaResponse;
  }

  signup() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    console.log(this.signupForm.value);
    this.authService.registerJobSeeker(this.signupForm.value, this.captchaResponse).subscribe(
      res => {
        console.log('registered');
        console.log(res);
        this.router.navigate(['/Login']);
        },
      err => {
         console.log('not registered');
      }
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  }
