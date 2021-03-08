import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UiServiceService } from './ui-service.service';
import { UrlRestService } from './url-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ReposicionService {

  datos: any[];
  item: any;
  itemProducto: any;

  constructor(
    private http: HttpClient,
    private uiService: UiServiceService,
    private urlRestService: UrlRestService) {

  }

  getPendientes(usuario: string, deposito: string) {

    // console.log('reposicionService - getPendientes');
    const url = this.urlRestService.getUrl() + '/reposicion' + '/' + usuario + '/' + deposito;
    return this.http.get<any[]>(url);

  }

  getProductosPendiente(item: any) {

    if (!item) {
      return;
    }

    const url = this.urlRestService.getUrl() + '/reposicion/items/' + item.MODFOR.trim() + '/' + item.CODFOR.trim() + '/' + item.NROFOR;
    return this.http.get(url);

  }

  getItemPendiente(id: string) {

    if (id.length <= 0) {
      return;
    }

    const url = this.urlRestService.getUrl() + '/reposicion/' + id;
    return this.http.get(url);

  }

  confirmarCantidad(item: any, cantidad: number, faltante: number) {

    if (item === undefined) {
      this.uiService.alertaInformativa('No se encontró producto');
      return false;
    }

    if (cantidad + faltante <= item.CANTID) {

      item.CNTPCK = cantidad;
      item.CNTFST = faltante;

      this.uiService.presentToast('Producto registrado');
      return true;

    } else {
      this.uiService.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
      return false;
    }
  }

  confirmarItem(item: any) {

    const url = this.urlRestService.getUrl() + '/reposicion';
    return this.http.put<any>(url, item);
  }

  guardarItem(item: any) {

    const url = this.urlRestService.getUrl() + '/reposicion';
    return this.http.put<any>(url, item)
      .subscribe(resp => {

      });
  }

  removerItem(arr, item) {
    var i = arr.indexOf(item);
    i !== -1 && arr.splice(i, 1);
  }

  confirmarReposicion(nombreUsuario: any) {

    const url = this.urlRestService.getUrl() + '/reposicion/confirmar';
    return this.http.put<any>(url, { usuario: nombreUsuario });
  }

  resetCantidad(item: any) {

    item.CNTPCK = 0;
    item.ESTPCK = 'A';

  }
}
