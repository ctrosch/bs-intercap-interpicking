import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { URL_REST } from '../config/config';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PickingService {

  item: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    public toastController: ToastController) {

  }

  getPendientes() {

    console.log('PackingService - getPendientes');
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
      return false;
    }

    if (cantidad <= item.CANTID) {

      item.CNTPCK = cantidad;

      /**
      if (item.CNTPCK === item.CANTID) {

        item.ESTPCK = 'B';

      }
       */
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

  confirmarPicking(nombreUsuario: any) {

    const url = URL_REST + '/colecta/confirmar';
    return this.http.put<any>(url, { usuario: nombreUsuario });

  }

  confirmarItem(item: any) {

    console.log('Confirmar item' + item.ID);

    const url = URL_REST + '/colecta';
    return this.http.put<any>(url, item);
  }


  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }


  async cargarStorage() {

    console.log('PackingService - cargarStorage');
    const datos = this.storage.get('data-colecta');

    if (datos) {
      return datos;
    }
  }

  guardarStorage(datos: any[]) {

    console.log('PackingService - guardarStorage');
    this.storage.set('data-colecta', datos);

  }

  resetStorage(datos: any[]) {

    datos.forEach(item => {
      item.CNTPCK = 0;
      item.ESTPCK = 'A';
    });

    this.guardarStorage(datos);
    this.presentToast('Datos reiniciados');
  }

  resetCantidad(item: any) {

    item.CNTPCK = 0;
    item.ESTPCK = 'A';
  }


}
