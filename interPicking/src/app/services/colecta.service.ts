import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { URL_REST } from '../config/config';
import { async } from '@angular/core/testing';
import { resolve } from 'url';
import { Storage } from '@ionic/storage';
import { ok } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class ColectaService {

  item: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    public toastController: ToastController) {

  }

  getPendientes() {

    console.log('ColectaService - getPendientes');
    const url = URL_REST + '/colecta' + '/000004' + '/40';
    return this.http.get<any[]>(url);

  }

  getItemPendiente(id: string) {

    if (id.length <= 0) {
      return;
    }

    const url = URL_REST + '/colecta/' + id;
    return this.http.get(url);

  }

  confirmarCantidad(item: any, cantidad: number) {

    if (item === undefined) {
      this.presentToast('No se encontró producto');
      return;
    }

    if (cantidad <= item.CANTID) {

      item.CNTPCK = cantidad;

      if (item.CNTPCK === item.CANTID) {

        item.ESTPCK = 'B';

      }
      this.presentToast('Producto registrado');

      return true;
    } else {
      this.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
      return false;
    }

  }

  guardarItem(item: any) {

    const url = URL_REST + '/colecta';
    return this.http.put<any>(url, item)
      .subscribe(resp => {

      });
  }

  removerItem(arr, item) {
    var i = arr.indexOf(item);
    i !== -1 && arr.splice(i, 1);
  }

  guardarDatos(datos: any[]) {

    const url = URL_REST + '/colecta';
    return this.http.put<any>(url, datos);

  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }


  async cargarStorage() {

    console.log('ColectaService - cargarStorage');
    const datos = this.storage.get('data-colecta');

    if (datos) {
      return datos;
    }
  }

  guardarStorage(datos: any[]) {

    console.log('ColectaService - guardarStorage');
    this.storage.set('data-colecta', datos);

  }

  resetStorage(datos: any[]) {

    datos.forEach(item => {
      item.CNTPCK = 0;
      item.estadoPicking = 'A';
    });

    this.guardarStorage(datos);
    this.presentToast('Datos reiniciados');
  }

  resetCantidad(item: any) {

    item.CNTPCK = 0;
    item.estadoPicking = 'A';

  }

}
