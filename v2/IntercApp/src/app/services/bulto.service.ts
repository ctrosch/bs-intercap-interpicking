import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { URL_REST } from '../config/config';
import { Storage } from '@ionic/storage';
import { UiServiceService } from './ui-service.service';



@Injectable({
  providedIn: 'root'
})
export class BultoService {

  datos: any[];
  bulto: any;
  item: any;
  itemProducto: any;

  constructor(
    private http: HttpClient,
    private uiService: UiServiceService) {

  }

  getListaByUsuario(usuario: string, estado: string) {

    const url = URL_REST + '/bultos/pendientes/' + usuario + '/' + estado;
    return this.http.get<any[]>(url);
  }

  getBulto(codfor: string, nrofor: string) {

    const url = URL_REST + '/bultos' + '/' + codfor + '/' + nrofor;
    return this.http.get<any[]>(url);
  }

  getProximoNumero(codfor: string) {

    const url = URL_REST + '/bultos/' + codfor;
    return this.http.get<any[]>(url);

  }

  guardar(bulto: any) {

    const url = URL_REST + '/bultos';
    return this.http.post<any>(url, bulto);
  }

  actualizar(bulto: any) {

    const url = URL_REST + '/bultos';
    return this.http.put<any>(url, bulto);
  }

  
}
