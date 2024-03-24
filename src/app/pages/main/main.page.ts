import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  titleName = 'Menú'
  pages = [
    {title: 'Home', url: '/main/home', icon: 'home-outline'},
    {title: 'Perfil', url: '/main/profile', icon: 'person-outline'},
    {title: 'Clientes', url: '/main/clients', icon: 'person-add-outline'},
    {title: 'Notificações', url: '/main/notifications', icon: 'send-outline'},
    {title: 'Financeiro', url: '/main/financial', icon: 'wallet-outline'}
  ]
  router = inject(Router);
  currentPath: string = '';
  sessionName = 'Sair da conta'
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  singOut() {
    this.firebaseSvc.signOut();
  }
}
