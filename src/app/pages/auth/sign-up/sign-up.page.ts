import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  titleName: string = 'Sign Up';
  nameLabel: string = 'name';
  emailLabel: string = 'Email';
  passwordLabel: string = 'Password';
  signUpRoute = 'sign-up';
  forgotPasswordRoute = 'forgot-password';

  ngOnInit() {}

  async submitLoginData() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      this.firebaseSvc
        .signUp(this.form.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.form.value.name);
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
