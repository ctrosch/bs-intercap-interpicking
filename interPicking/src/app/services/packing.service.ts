import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { URL_REST } from '../config/config';
import { Storage } from '@ionic/storage';
import { UiServiceService } from './ui-service.service';


@Injectable({
  providedIn: 'root'
})
export class PackingService {

  item: any;
  itemProducto: any;

  constructor(
    private http: HttpClient,
    private uiService: UiServiceService) {

  }

  getPendientes(usuario: string, deposito: string) {

    // console.log('PackingService - getPendientes');
    const url = URL_REST + '/packing' + '/' + usuario + '/' + deposito;
    return this.http.get<any[]>(url);

  }

  getProductosPendiente(item: any) {

    if (!item) {
      return;
    }

    const url = URL_REST + '/packing/items/' + item.MODFOR + '/' + item.CODFOR + '/' + item.NROFOR;
    return this.http.get(url);

  }

  getItemPendiente(id: string) {

    if (id.length <= 0) {
      return;
    }

    const url = URL_REST + '/packing/' + id;
    return this.http.get(url);

  }

  confirmarCantidad(item: any, cantidad: number) {

    if (item === undefined) {
      this.uiService.alertaInformativa('No se encontró producto');
      return;
    }

    if (cantidad <= item.CANTID) {

      item.CNTPK2 = cantidad;

      this.uiService.presentToast('Producto registrado');

      return true;
    } else {
      this.uiService.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
      return false;
    }

  }

  confirmarItem(item: any) {

    const url = URL_REST + '/packing';
    return this.http.put<any>(url, item);
  }

  guardarItem(item: any) {

    const url = URL_REST + '/packing';
    return this.http.put<any>(url, item)
      .subscribe(resp => {

      });
  }

  removerItem(arr, item) {
    var i = arr.indexOf(item);
    i !== -1 && arr.splice(i, 1);
  }

  confirmarPacking(nombreUsuario: any) {

    const url = URL_REST + '/packing/confirmar';
    return this.http.put<any>(url, { usuario: nombreUsuario });
  }

  resetCantidad(item: any) {

    item.CNTPK2 = 0;
    item.ESTPK2 = 'A';

  }
}
