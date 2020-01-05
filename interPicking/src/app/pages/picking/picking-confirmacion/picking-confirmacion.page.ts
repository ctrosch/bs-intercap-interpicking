import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickingService } from '../../../services/picking.service';

@Component({
  selector: 'app-picking-confirmacion',
  templateUrl: './picking-confirmacion.page.html',
  styleUrls: ['./picking-confirmacion.page.scss'],
})
export class PickingConfirmacionPage implements OnInit {

  datos: any[] = [];

  constructor(
    private router: Router,
    private pickingService: PickingService) { }

  ngOnInit() {

    this.pickingService.cargarStorage().then(datos => {

      // this.datos = datos;
      console.log(this.datos);
    });

  }

  confirmarColecta() {

    /**
    this.pickingService.guardarDatos(this.datos)
      .subscribe(resp => {
        if (resp.ok) {
          console.log('Datos guardados correctamente');
          
        }
      });
       */
  }

  volver(){
    this.router.navigateByUrl('colecta');
  }
}
