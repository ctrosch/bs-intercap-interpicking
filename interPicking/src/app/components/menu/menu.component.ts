import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';
import { resolve } from 'url';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {

    this.usuarioService.cargarToken().then( () => {
        this.usuario = this.usuarioService.usuario;
    });
  }

  logout() {

    this.usuarioService.logout();

  }

}
