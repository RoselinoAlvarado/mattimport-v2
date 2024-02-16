import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  titleName: string = 'Login';
  emailLabel: string = 'Email';
  passwordLabel: string = 'Password';
  signUpRoute = 'sign-up';
  forgotPasswordRoute = 'forgot-password';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  ngOnInit() {}

  async submitLoginData() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);

          this.utilSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
