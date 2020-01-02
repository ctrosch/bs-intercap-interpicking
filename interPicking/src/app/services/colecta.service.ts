import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { URL_REST } from '../config/config';
import { async } from '@angular/core/testing';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class ColectaService {

  datos: any[];
  item: any;

  constructor(
    private http: HttpClient,
    public toastController: ToastController) {

    this.cargarPendientes();
    
  }

  cargarPendientes = () => {

    console.log('ColectaService - cargarPendientes');

    return new Promise((resolve, reject) => {

      const url = URL_REST + '/colecta' + '/000004' + '/40';

      this.http.get<any[]>(url)
        .subscribe((resp: any) => {
          this.datos = resp.colecta;
          this.guardarStorage();

          if (!this.datos) {
            reject('No se encontraron pendientes');
          } else {
            resolve(this.datos);
          }

        });
  
     });
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

      this.guardarStorage();      
      this.presentToast('Producto registrado');
      return true;
    } else {
      this.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
      return false;
    }

  }

  guardarItem(item: any) {

    const url = URL_REST + '/colecta';
    this.http.put<any>(url, item)
      .subscribe(resp => {

        if (resp.ok) {
          console.log('ColectaService - guardarItem', item);
        }

      });
  }

  confirmarColecta() {

    console.log('ColectaService - confirmar colecta');

    this.datos.forEach(i => {

      if (i.ESTPCK === 'B') {
        this.guardarItem(i);
      }
    });

    this.cargarPendientes();   
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  
  cargarStorage() {

    if (localStorage.getItem('data-colecta')) {
      this.datos = JSON.parse(localStorage.getItem('data-colecta'));
    }
  }

  guardarStorage() {
  
    console.log('ColectaService - guardarStorage');

    localStorage.setItem('data-colecta', JSON.stringify(this.datos));

  }

  resetStorage() {

    this.datos.forEach(item => {
      item.CNTPCK = 0;
      item.estadoPicking = 'A';
    });

    this.guardarStorage();
    this.presentToast('Datos reiniciados');
  }

  resetCantidad(item: any){

    item.CNTPCK = 0;
    item.estadoPicking = 'A';

    

  }

}
