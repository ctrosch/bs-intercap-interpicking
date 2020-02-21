import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { AppUpdate } from '@ionic-native/app-update/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: Usuario = {};
  version: string;

  componentes: Componente[] = [
    {
      icon: 'codebar',
      name: 'Picking',
      imagen: '/assets/img/colecta.png',
      redirectTo: '/picking',
      detalle: 'Realizar colecta general para todos los despachos pendientes'
    },
    {
      icon: 'appstore',
      name: 'Packing',
      imagen: '/assets/img/armado.png',
      redirectTo: '/packing',
      detalle: 'Realizar armado despacho por clientes'
    },
    {
      icon: 'beaker',
      name: 'Recepción',
      imagen: '/assets/img/recepcion.png',
      redirectTo: '/recepcion',
      detalle: 'Recibir mercadería que envían los proveedores'
    },
    {
      icon: 'radio-button-on',
      name: 'Toma Inventario ',
      imagen: '/assets/img/inventario.png',
      redirectTo: '/toma-inventario',
      detalle: 'Realizar toma de inventario'
    }
  ];

  constructor(private menuController: MenuController,
              private usuarioService: UsuarioService,
              private appUpdate: AppUpdate) {
    
      const updateUrl = 'http://beansoft.com.ar/app/update.xml';
      this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('Actualización disponible ') });    
    

  }

  ngOnInit() {

    this.usuarioService.cargarToken().then( () => {
      this.usuario = this.usuarioService.usuario;
      console.log(this.usuario);
  });


    }

  toggleMenu() {

    this.menuController.toggle();

  }

}

interface Componente {
  icon: string;
  name: string;
  imagen: string;
  redirectTo: string;
  detalle: string;
}

