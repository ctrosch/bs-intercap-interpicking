import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../services/packing.service';
import { BultoService } from '../../../services/bulto.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FiltroService } from '../../../services/filtro.service';
import { Router } from '@angular/router';
import { UiServiceService } from '../../../services/ui-service.service';
import { IonSegment, LoadingController, NavController, IonToggle } from '@ionic/angular';
import { Usuario } from '../../../model/usuario';
import { Filtro } from '../../../model/filtro';
import { Bulto } from '../../../model/bulto';

@Component({
  selector: 'app-packing-clientes',
  templateUrl: './packing-clientes.page.html',
  styleUrls: ['./packing-clientes.page.scss'],
})
export class PackingClientesPage implements OnInit {

  usuario: Usuario = {};
  bulto: Bulto = {};

  pendiente = true;
  completados = false;
  filtro: Filtro;

  datos: any[];
  bultos: any[];
  codigoManual: string;
  mensaje: string;
  porcentaje = 0;
  cargando = false;
  titulo = 'Selecionar Cliente';
  procesando: any;

  circuito: string;

  constructor(private packingService: PackingService,
    private bultoService: BultoService,
    private usuarioService: UsuarioService,
    public filtroService: FiltroService,
    private uiService: UiServiceService,
    private router: Router,
    public loadingController: LoadingController,
    private navCtrl: NavController) {
    
    this.usuario = this.usuarioService.getUsuario();
    this.bulto = this.bultoService.bulto;

  }

  ngOnInit() {

    this.cargarPendientes();

  }

  cargarPendientes(event?) {

    this.cargando = true;

    if (!this.bulto) {
      return;
    }


    this.packingService.getPendientes(this.bulto.USRPCK, this.bulto.DEPOSI)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.clientes;

          if (event) {
            event.target.complete();
          }

        } else {
          console.log('No hay clientes con productos de packing en estos momentos');
        }
        this.cargando = false;
      });

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  seleccionarItem(datosCliente: any) {

    this.bulto = this.bultoService.bulto;

    this.bulto.NROCTA = datosCliente.NROCTA;
    this.bulto.TRACOD = datosCliente.TRACOD;
    this.bulto.CIRCOM = datosCliente.CIRCOM;

    this.bultoService.guardar(this.bulto)
      .subscribe(resp => {

        console.log('respuesta de guardar');
        console.log(resp);

        if (resp.ok) {

          this.getBulto(this.bulto.CODFOR, this.bulto.NROFOR);
          
        } else {          
          
        }
      });
    

    
  }

  getBulto(codfor: string, nrofor: string) {

    this.cargando = true;

    this.bultoService.getBulto(codfor, nrofor)
      .subscribe((resp: any) => {

        if (resp.ok) {
          
          this.bulto = resp.bulto;
          this.packingService.item = this.bulto;
          this.bultoService.bulto = this.bulto;
          console.log('Respuesta de get bulto ' + this.bulto);
          this.router.navigateByUrl('packing-producto/' + this.bulto.NROCTA);

        } else {
          console.log('No se encontró bulto');
          return;
        }
        this.cargando = false;
      });

  }

}
