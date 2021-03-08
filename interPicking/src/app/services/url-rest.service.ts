import { Injectable } from '@angular/core';
import { URL_REST, URL_REST_TEST } from '../config/config';
import { Storage } from '@ionic/storage';
import { Empresa } from '../model/empresa';

@Injectable({
  providedIn: 'root'
})
export class UrlRestService {

  empresa: Empresa = {
    CODIGO: 'P',
    NOMBRE: 'Intercap SRL',
    URL: 'http://intercap.com.ar:3000'
  };

  url: string;

  constructor(private storage: Storage) {

    console.log("Iniciando UrlRestService");
    this.cargar();

  }

  async cargar() {

    this.empresa = await this.storage.get("empresa") || null;

    if (!this.empresa) {

      this.empresa = {
        CODIGO: 'P',
        NOMBRE: 'Intercap SRL',
        URL: 'http://intercap.com.ar:3000'
      }
      this.guardar(this.empresa);
    }

  }

  async guardar(empresa: Empresa) {

    this.empresa = empresa;
    await this.storage.set("empresa", empresa);

    this.cargar();

  }



  getUrl() {

    console.log("getUrl en empresa " + this.empresa.NOMBRE);

    if (this.empresa) {
      return this.empresa.URL;
    }else{      
      return "";
    }    
  }
}
