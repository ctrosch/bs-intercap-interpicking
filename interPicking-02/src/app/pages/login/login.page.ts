import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  cargando = false;
  
  loginUser = {
    ID: '',
    USUARIO: '',
    NOMBRE: '',
    DEPOSITO: '',
    PASSWORD: '',
    IMAGEN: 'av-1.png'
  };

  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    },
    {
      img: 'av-2.png',
      seleccionado: false
    },
    {
      img: 'av-3.png',
      seleccionado: false
    },
    {
      img: 'av-4.png',
      seleccionado: false
    },
    {
      img: 'av-5.png',
      seleccionado: false
    },
    {
      img: 'av-6.png',
      seleccionado: false
    },
    {
      img: 'av-7.png',
      seleccionado: false
    },
    {
      img: 'av-8.png',
      seleccionado: false
    },
];

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private uiService: UiServiceService) { }

  ngOnInit() {
    this.slides.lockSwipes( true );
  }

  async login(fLogin: NgForm) {
    
    if ( fLogin.invalid ) { return; }

    const valido = await this.usuarioService.login( this.loginUser.USUARIO, this.loginUser.PASSWORD );

    if ( valido ) {
      // navegar al tabs
      this.navCtrl.navigateRoot( '/home', { animated: true } );
    } else {
      // mostrar alerta de usuario y contraseña no correctos
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos o el usuario no tiene depósito asignado');
    }
  }

  seleccionarAvatar(avatar) {
    
    this.avatars.forEach(av => av.seleccionado = false);
    avatar.seleccionado = true;

  }

}
