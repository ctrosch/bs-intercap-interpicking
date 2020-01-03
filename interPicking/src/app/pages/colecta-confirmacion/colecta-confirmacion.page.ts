import { Component, OnInit } from '@angular/core';
import { ColectaService } from '../../services/colecta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colecta-confirmacion',
  templateUrl: './colecta-confirmacion.page.html',
  styleUrls: ['./colecta-confirmacion.page.scss'],
})
export class ColectaConfirmacionPage implements OnInit {

  datos: any[] = [];

  constructor(
    private router: Router,
    private colectaService: ColectaService) { }

  ngOnInit() {

    this.colectaService.cargarStorage().then(datos => {

      this.datos = datos;
      console.log(this.datos);
    });

  }

  confirmarColecta() {

    this.colectaService.guardarDatos(this.datos)
      .subscribe(resp => {
        if (resp.ok) {
          console.log('Datos guardados correctamente');
          
        }
      });
  }

  volver(){
    this.router.navigateByUrl('colecta');
  }

}
