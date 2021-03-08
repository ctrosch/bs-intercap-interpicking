import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Usuario } from '../model/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { UrlRestService } from './url-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  usuario: Usuario = {};

  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController,
               private urlRestService: UrlRestService ) { }


  login( usuario: string, password: string ) {

    const data = { usuario, password };

    // console.log(data);

    return new Promise( resolve => {

      this.http.post(`${ this.urlRestService.getUrl() }/login`, data )
        .subscribe( async resp => {
          // console.log(resp);

          if ( resp['ok'] ) {
            await this.guardarToken(resp['token']);
            await this.guardarUsuario(resp['usuario']);
            resolve(true);
          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
            //resolve(resp['mensaje']);
          }

        }, error => {
            resolve(false);
            //resolve('Error de conexión, servicio no disponible');
        });
    });

  }

  logout() {
    
    this.token   = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

  registro( usuario: Usuario ) {

    return new Promise( resolve => {

      this.http.post(`${ this.urlRestService.getUrl() }/usuario`, usuario )
          .subscribe( async resp => {
            console.log(resp);

            if ( resp['ok'] ) {
              await this.guardarToken( resp['token'] );
              resolve(true);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(false);
            }

          });


    });


  }

  getUsuario() {

    if ( !this.usuario.ID ) {
      this.validaToken();
    }

    return { ...this.usuario };

  }


  async guardarToken( token: string ) {

    this.token = token;
    await this.storage.set('token', token);

    await this.validaToken();


  }

  async cargarToken() {

    this.token = await this.storage.get('token') || null;
    this.usuario = await this.storage.get('usuario') || null;

  }

  async guardarUsuario( usuario: Usuario ) {

    this.usuario = usuario;
    await this.storage.set('usuario', usuario);

    await this.validaToken();


  }

  async cargarUsuario() {

    this.usuario = await this.storage.get('usuario') || null;

  }
  
  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return Promise.resolve(true);


    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get(`${ this.urlRestService.getUrl() }/usuario/`, { headers })
        .subscribe( resp => {

          if ( resp['ok'] ) {
            this.usuario = resp['usuario'];
            resolve(true);
          } else {
            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }

        });


    });

  }


  actualizarUsuario( usuario: Usuario ) {


    const headers = new HttpHeaders({
      'x-token': this.token
    });


    return new Promise( resolve => {

      this.http.post(`${ this.urlRestService.getUrl() }/usuario/update`, usuario, { headers })
        .subscribe( resp => {

          if ( resp['ok'] ) {
            this.guardarToken( resp['token'] );
            resolve(true);
          } else {
            resolve(false);
          }

        });

    });



  }

}
