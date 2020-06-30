import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  mensajes: OSNotificationPayload[] = [];

  constructor(public pushService: PushService,
              private aplicationRef: ApplicationRef) {}

  ngOnInit(){
    this.pushService.pushListener.subscribe(notificacion => {
      this.mensajes.unshift(notificacion);
      this.aplicationRef.tick();
    });
  }

  async ionViewWillEnter() {
    console.log('Will enter - Cargar Mensajes');
    this.mensajes = await this.pushService.getMensajes();
  }
  async borrarMensajes(){
    await this.pushService.borrarMensajes();
    this.mensajes = [];
  }
}
