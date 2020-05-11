import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonSegment, NavController, IonToggle } from '@ionic/angular';
import { PickingService } from '../../services/picking.service';
import { LoadingController } from '@ionic/angular';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';
import { DataLocalService } from '../../services/data-local.service';





@Component({
  selector: 'app-picking',
  templateUrl: './picking.page.html',
  styleUrls: ['./picking.page.scss'],
})
export class PickingPage implements OnInit {

  @ViewChild(IonSegment, { static: true }) segment: IonSegment;
  @ViewChild(IonToggle, { static: true }) toggle: IonToggle;

  usuario: Usuario = {};

  completados = false;
  pipeTrigger = false;
  filtro: Filtro;

  datos: any[];
  clientes: any[];

  codigoManual: string;
  porcentaje = 0;
  cargando = false;
  titulo = 'Picking';
  procesando: any;

  circuito: string;



  constructor(private pickingService: PickingService,
    private usuarioService: UsuarioService,
    private uiService: UiServiceService,
    public filtroService: FiltroService,
    private dataLocal: DataLocalService,
    private barcodeScanner: BarcodeScanner,
    public loadingController: LoadingController,
    private router: Router,
    private navCtrl: NavController) {

  }

  ngOnInit() {

    console.log('************************* INI *********************************************');

    this.filtro = this.filtroService.inicializarFiltro('filtro-picking');
    this.usuario = this.usuarioService.getUsuario();
    
    this.cargarPendientes();

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

  }

  ionViewDidEnter() {

    console.log('ionViewDidEnter');

    this.pipeTrigger = !this.pipeTrigger;
    
  }

  cargarPendientes(event?) {

    console.log('************************* BUSCA PENDIENTES *********************************************');

    this.cargando = true;

    if (this.segment) {
      this.segment.value = 'pendientes';
    }

    this.pickingService.getPendientes(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.colecta;
          this.pickingService.datos = this.datos;

          if (event) {
            event.target.complete();
          }

          //this.titulo = 'Picking ('+this.datos.length+')';
          //this.titulo = 'Picking ('+this.filtroPipe.transform(this.datos,this.completados,this.filtro).length+')';

        } else {

          this.uiService.alertaInformativa('No hay pendientes de colecta en estos momentos');
          this.navCtrl.navigateRoot('/home', { animated: true });
        }

        this.cargando = false;

      });

  }

  recargar(event) {

    this.cargarPendientes(event);

  }

  seleccionarItem(i: any) {

    this.pickingService.item = i;    
    this.router.navigateByUrl('picking-item/' + i.ID);
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      // swal({title: 'Error',text: 'Error leyendo código de barra',icon: 'error',});
    });
  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  procesarCodigoBarra(codigoBarra: string) {

    console.log("Codigo de barra leido: " + codigoBarra);

    this.dataLocal.guardarRegistro('codigo',codigoBarra);

    if (codigoBarra === undefined) {
      this.uiService.presentToast('Código de barra vacío');
      return;
    } else {
      codigoBarra = codigoBarra.replace('\n', '');
      codigoBarra = codigoBarra.trim();
    }

    if (codigoBarra.length > 0) {

      console.log('Codigo de barra limpio: ' + codigoBarra);

      let itemEncontrado: any;

      this.datos.find(item => {

        if (item.CNTPCK + item.CNTFST < item.CANTID) {

          console.log('Codigo de barra item: ' + item.CODBAR);

          item.CODBAR.split('|').find(i => {

            console.log('Codigo de barra disponible: ' + i);

            if (i.trim() === codigoBarra) {
              itemEncontrado = item;
              return;
            }
          });
        }

      });

      if (itemEncontrado) {
        this.seleccionarItem(itemEncontrado);
      } else {
        this.uiService.alertaInformativa('No se encontró producto con el código de barra ' + codigoBarra);
        // swal({title: 'Error',text: 'El código de barra no pertenece a ningún producto pendiene de picking',icon: 'error',});
      }

    } else {
      this.uiService.presentToast('Código de barra vacío');
    }
  }

  
  confirmarPicking() {

    this.presentLoading();

    this.pickingService.confirmarPicking(this.usuario.USUARIO)
      .subscribe(resp => {

        if (resp.ok) {

          this.filtroService.limpiarFiltro();          
          this.toggle.checked = false;
          this.cargarPendientes();
          this.procesando.dismiss();


          // swal("Picking confirmado","Los productos fueron confirmados correctamente","success").then(value => {});
        } else {
          // swal("Error", "No es posible guardar los datos", "error");
          this.procesando.dismiss();
          this.uiService.alertaInformativa('No es posible confirmar picking en estos momentos');
        }
      } );    
    
  }


  async presentLoading() {
    this.procesando = await this.loadingController.create({
      message: 'Procesando información'
    });
    return this.procesando.present();
  }

  segmentChanged(event) {
    //this.completados = (this.segment.value === 'completados');
  }

  toggleChanged(event) {
    this.completados = !this.completados;
  }

  verFiltro() {
    this.router.navigateByUrl('filtro-picking');
  }


  volverEstado(i: any) {

    console.log('volver estado');

    if (!i) {
      return;
    }

      i.ESTPCK = 'A';      
      i.USRPCK = '';
      i.CNTPCK = 0;
   

    this.pickingService.confirmarItem(i)
      .subscribe(resp => {
        if (resp.ok) {

          this.pipeTrigger = !this.pipeTrigger;

        } else {
          // swal({title: 'Error',text: 'Problemas para confirmar picking',icon: 'error',});
        }
      });

  }

}

