import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  titleName = 'Perfil'
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`
    const dataUrl = (await this.utilSvc.takePicture('Imagen de Perfil')).dataUrl;
    const loading = await this.utilSvc.loading();
    await loading.present();
    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {
      this.utilSvc.saveInLocalStorage('user', user);
      loading.dismiss();
      this.utilSvc.presentToast({
        message: 'Imagem atualizada com sucesso',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })
    }).catch(error => {
      console.error(error);
      this.utilSvc.presentToast({
        message: `Erro ao atualizadar a imagem: ${error.message}`,
        duration: 4500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    })
  }
}
