import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { URL_REST } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class ColectaService {

  //datos: any[] = [];
  datosIniciales: any[] = [];

  constructor(private http: HttpClient,
    public toastController: ToastController) {

    this.getPendientes();
    
  }

  getPendientes(){

    const url = URL_REST + '/colecta' + '/000004' + '/40';
    return this.http.get<any[]>(url); 
  }

  getItemPendinte(id: string) {

    if (id.length <= 0) {
      return;
    }

    const url = URL_REST + '/colecta/' + id;
    return this.http.get(url);
    
  }



  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  getDatosIniciales() {

    let url = URL_REST + "/colecta" + "/000004" + "/40"

    this.http.get<any[]>(url).subscribe(results => this.datosIniciales = results);
  }

  cargarStorage() {

    if (localStorage.getItem('data')) {
      this.datos = JSON.parse(localStorage.getItem('data'));
    } else {

      this.datos = this.datosIniciales;
      this.guardarStorage();
    }
  }

  guardarStorage() {

    localStorage.setItem('data', JSON.stringify(this.datos));

  }

  resetStorage() {

    this.datos.forEach(function (item) {
      item.cantidadPicking = 0;
      item.estadoPicking = 'A';
    });

    this.guardarStorage();
    this.presentToast('Datos reiniciados');
  }

  getItem(id: string) {

    let parametros: string[] = id.split('-');

    let numeroFormulario: Number = new Number(parametros[0]);
    let itemAplicacion: Number = new Number(parametros[1]);

    return this.datos.find(dato => {

      //console.log('id: ' + id + 'numero formulario' + dato.numeroFormulario) ;
      //console.log(dato.numeroFormulario == id);

      return (dato.numeroFormulario == numeroFormulario && dato.itemAplicacion == itemAplicacion);
    });

  }

  getItemByCodigoBarra(codigoBarra: string) {

    return this.datos.find(dato => {

      return (dato.codigo == codigoBarra && dato.cantidadPicking < dato.cantidad);
    });

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra.length === 0) {
      this.presentToast('Código de barra vacío');
      return;
    }

    let item: any = this.getItemByCodigoBarra(codigoBarra);

    return this.confirmarCantidad(item);

  }


  confirmarCantidad(item: any) {

    if (item === undefined) {
      this.presentToast('No se encontró producto');
      return;
    }

    if (item.cantidadPicking < item.cantidad) {

      item.cantidadPicking = item.cantidadPicking + 1;

      if (item.cantidadPicking == item.cantidad) {

        item.estadoPicking = 'B';

      }
      this.guardarStorage();
      this.presentToast('Producto registrado');
    } else {
      this.presentToast('Ha ingresado todos las cantidades necesarias');
    }

  }

  confirmarCantidadManual(item: any, cantidad: number) {

    if (item === undefined) {
      this.presentToast('No se encontró producto');
      return;
    }

    if (cantidad <= item.cantidad) {

      item.cantidadPicking = cantidad;

      if (item.cantidadPicking == item.cantidad) {

        item.estadoPicking = 'B';

      }
      this.guardarStorage();
      this.presentToast('Producto registrado');
    } else {
      this.presentToast('El valor para cantidad no puede ser mayor a lo solicitado');
    }

  }

  resetCantidad(item: any){

    item.cantidadPicking = 0;
    item.estadoPicking = 'A';

  }

  public getPendientes2() {

    let headers = new HttpHeaders();

    //headers.set('Content-Type', 'application/json;charset=UTF-8');
    //headers.set('Authorization', 'Basic ' + btoa('zoho:Ss2M3iso0n'));
    //return this.http.get('http://localhost:8090/API/rs/colecta/pendiente/40', { headers: headers} );


    return this.http.get('http://localhost:8080/API/rs/colecta/pendiente2/000002/20', {

      headers: {
        'Authorization': 'Basic em9obzpTczJNM2lzbzBu',       
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': '49f36ea4-87d1-4b18-a8b4-76465f28f119,9397fb19-0e23-49fb-9b48-e689179291f5',        
        'cache-control': 'no-cache'      
      }
    });
    /**
    getCurrentUser() {
      let url = this.baseUrl + 'user';
      let token = localStorage.getItem('token');
      let head = new Headers({
          'Content-Type': 'application/json',
          'X-Access-Token': token,
      });
      let options = new RequestOptions({ headers: head });

      return this.http.get(url, this.options).map(res => res.json());
  }
     */
  }
}
