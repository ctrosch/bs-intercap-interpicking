import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();
    console.log(this.usuario);

  }

  logout() {

    this.usuarioService.logout();

  }

}
