import { Injectable, EventEmitter } from '@angular/core';

import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //  tittle: 'Titulo del push',
    //  body: 'Este es el body del push',
    //  date: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(private oneSignal: OneSignal,
              private storage: Storage) {
                this.cargarMensajes();
               }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  configuracionInicial() {
    this.oneSignal.startInit('a0308b3c-184e-481f-b95b-7eeb395501cd', '464666844803');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((notificacion) => {
    // do something when notification is received
    console.log('Notificacion recibida', notificacion);
    this.notificacionRecibida(notificacion);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (notificacion) => {
      // do something when a notification is opened
      console.log('Notificacion abierta', notificacion);
      await this.notificacionRecibida(notificacion.notification);
    });
    // Obtener Id del suscriptor
    this.oneSignal.getIds().then(info => {
      this.userId = info.userId;
      console.log('userId', this.userId);
    });
    this.oneSignal.endInit();
  }

  async notificacionRecibida(notificacion: OSNotification) {
    await this.cargarMensajes();
    const payload = notificacion.payload;

    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush){
      return;
    }
    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    await this.guardarMensajes();
  }
  async guardarMensajes(){
    this.storage.set('mensajes', this.mensajes);
  }
  async cargarMensajes(){
    // this.storage.clear();
    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }
  async borrarMensajes(){
    await this.storage.clear();
    this.mensajes = [];
    this.guardarMensajes();
  }
}
