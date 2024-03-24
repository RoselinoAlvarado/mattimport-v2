import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  pages = [
    {title: 'Home', url: 'home', icon: 'home-outline'},
    {title: 'Perfil', url: 'profile', icon: 'person-outline'},
    {title: 'Clientes', url: 'clients', icon: 'person-add-outline'},
    {title: 'Notificações', url: 'notifications', icon: 'send-outline'},
    {title: 'Financeiro', url: 'financial', icon: 'wallet-outline'}
  ]

  ngOnInit() {
  }

}
