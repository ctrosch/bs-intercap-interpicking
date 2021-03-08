import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { UrlRestService } from '../../services/url-rest.service';
import { Empresa } from '../../model/empresa';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //@ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  cargando = false;

  loginUser = {
    ID: '',
    USUARIO: '',
    NOMBRE: '',
    DEPOSITO: '',
    PASSWORD: '',
    IMAGEN: 'av-1.png',
    EMPRESA: 'P'
  };

  empresa: Empresa = {
    CODIGO:'',
    NOMBRE:''
  };

  empresas: Empresa[] ;


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
    private urlRestService: UrlRestService,
    private navCtrl: NavController,
    private uiService: UiServiceService) {

      let empresa1: Empresa = {
        CODIGO:"P",
        NOMBRE:"Intercap SRL",
        URL: "http://intercap.com.ar:3000"
      }

      let empresa2: Empresa = {
        CODIGO:"T",
        NOMBRE:"Test",
        URL: "http://intercap.com.ar:3001"
      }

      this.empresas = new Array();

      this.empresas.push(empresa1);
      this.empresas.push(empresa2);
  }

  ngOnInit() {

    this.urlRestService.cargar();
  }

  async login(fLogin: NgForm) {

    if (fLogin.invalid) { return; }

    this.empresa = this.empresas.find(e => e.CODIGO==this.loginUser.EMPRESA);

    this.urlRestService.guardar(this.empresa);

    const valido = await this.usuarioService.login(this.loginUser.USUARIO, this.loginUser.PASSWORD);

    if (valido) {
      // navegar al tabs
      this.navCtrl.navigateRoot('/home', { animated: true });
    } else {
      // mostrar alerta de usuario y contraseña no correctos
      this.uiService.alertaInformativa('No se encontro usuario o contraseña incorrecta');
    }
  }

  seleccionarAvatar(avatar) {

    this.avatars.forEach(av => av.seleccionado = false);
    avatar.seleccionado = true;

  }


}
