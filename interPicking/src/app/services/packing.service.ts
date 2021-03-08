import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UiServiceService } from './ui-service.service';
import { UrlRestService } from './url-rest.service';


@Injectable({
  providedIn: 'root'
})
export class PackingService {

  datos: any[];
  item: any;
  itemProducto: any;

  

  constructor(

    private http: HttpClient,
    private uiService: UiServiceService,
    private urlRestService: UrlRestService) {

  }

  getPendientes(usuario: string, deposito: string) {

    // console.log('PackingService - getPendientes');
    const url = this.urlRestService.getUrl() + '/packing' + '/' + usuario + '/' + deposito;
    return this.http.get<any[]>(url);

  }

  getProductosPendiente(item: any) {

    if (!item) {
      return;
    }

    const url = this.urlRestService.getUrl() + '/packing/items/' + item.MODFOR + '/' + item.CODFOR + '/' + item.NROFOR;
    return this.http.get(url);

  }

  getItemPendiente(id: string) {

    if (id.length <= 0) {
      return;
    }

    const url = this.urlRestService.getUrl() + '/packing/' + id;
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

    const url = this.urlRestService.getUrl() + '/packing';
    return this.http.put<any>(url, item);
  }

  guardarItem(item: any) {

    const url = this.urlRestService.getUrl() + '/packing';
    return this.http.put<any>(url, item)
      .subscribe(resp => {

      });
  }

  removerItem(arr, item) {
    var i = arr.indexOf(item);
    i !== -1 && arr.splice(i, 1);
  }

  confirmarPacking(nombreUsuario: any) {

    const url = this.urlRestService.getUrl() + '/packing/confirmar';
    return this.http.put<any>(url, { usuario: nombreUsuario });
  }

  resetCantidad(item: any) {

    item.CNTPK2 = 0;
    item.ESTPK2 = 'A';

  }
}
