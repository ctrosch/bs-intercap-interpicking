import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_REST } from '../config/config';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class PickingService {

  item: any;
  usuario: string;

  constructor(
    private http: HttpClient,    
    private uiService: UiServiceService) {

  }

  getPendientes(usuario: string, deposito: string) {

    // console.log('PackingService - getPendientes');
    const url = URL_REST + '/colecta' + '/' + usuario + '/' + deposito;

    return this.http.get<any[]>(url);

  }

  getItemPendiente() {

    if(!this.item){
      return;
    }

    if (this.item.id.length <= 0) {
      return;
    }

    const url = URL_REST + '/colecta/' + this.item.id;
    return this.http.get<any>(url);

  }

  confirmarCantidad(item: any, cantidad: number) {

    if (item === undefined) {
      this.uiService.alertaInformativa('No se encontró producto');
      return false;
    }

    if (cantidad <= item.CANTID) {

      item.CNTPCK = cantidad;

      this.uiService.presentToast('Producto registrado');
      return true;

    } else {
      this.uiService.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
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

    const url = URL_REST + '/colecta';
    return this.http.put<any>(url, item);
  }

  resetCantidad(item: any) {

    item.CNTPCK = 0;
    item.ESTPCK = 'A';
  }


}
