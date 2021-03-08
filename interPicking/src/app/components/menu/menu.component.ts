import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { resolve } from 'url';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UrlRestService } from '../../services/url-rest.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  usuario: Usuario = {};
  version: string;

  constructor(private usuarioService: UsuarioService,
              private urlRestService: UrlRestService,
              private appVersion: AppVersion) { 

    this.appVersion.getVersionNumber().then(value => {
      this.version = value;
    }).catch(err => {
      
    });


  }

  ngOnInit() {

    console.log('Menu Component  ++++++++++++++++++++++++++++++++++++++++++++++++++++');

    this.usuarioService.cargarToken().then( () => {
        this.usuario = this.usuarioService.usuario;
    });

    
  }

  logout() {

    this.usuarioService.logout();

  }

}
