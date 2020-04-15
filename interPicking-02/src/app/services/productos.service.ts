import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  public getProductos() {

    return this.http.get('http://www.intercap.com.ar/API/rs/dropshipping/catalogo/001/001');

  }

}
