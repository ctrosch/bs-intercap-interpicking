import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonSegment, LoadingController, NavController, IonToggle } from '@ionic/angular';
import { PackingService } from '../../services/packing.service';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { BultoService } from '../../services/bulto.service';
import { UiServiceService } from '../../services/ui-service.service';
import { FiltroService } from '../../services/filtro.service';
import { Filtro } from '../../model/filtro';
import { Bulto } from '../../model/bulto';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.page.html',
  styleUrls: ['./packing.page.scss'],
})
export class PackingPage implements OnInit {

  // @ViewChild(IonSegment, {static: true}) segment: IonSegment;
  @ViewChild(IonToggle, { static: true }) toggle: IonToggle;

  usuario: Usuario = {};

  pendiente = true;
  completados = false;
  filtro: Filtro;

  datos: any[];
  bultos: any[];
  codigoManual: string;
  mensaje: string;
  porcentaje = 0;
  cargando = false;
  titulo = 'Packing';  
  procesando: any;

  circuito: string;

  constructor(private packingService: PackingService,
    private bultoService: BultoService,
    private usuarioService: UsuarioService,
    public filtroService: FiltroService,
    private uiService: UiServiceService,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public loadingController: LoadingController,
    private navCtrl: NavController) {

  }

  ngOnInit() {

    this.filtro = this.filtroService.inicializarFiltro('filtro-packing');
    this.usuario = this.usuarioService.getUsuario();

  }

  ionViewDidEnter() {

    this.getBultosPendientes();

    //this.cargarPendientes();

  }

  getBultosPendientes(event?) {

    this.cargando = true;
    this.mensaje = null;

    this.bultoService.getListaByUsuario(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.bultos;
          this.bultoService.datos = this.datos;

          if (event) {
            event.target.complete();
          }

          this.titulo = 'Bultos (' + this.datos.length + ')';

        } else {
          //this.uiService.alertaInformativa('No se encontraron bultos pendientes de facturar');
          this.mensaje = 'No se encontraron bultos pendientes de facturar';
        }

        this.cargando = false;

      });




  }

  cargarPendientes(event?) {

    this.cargando = true;

    this.packingService.getPendientes(this.usuario.USUARIO, this.usuario.DEPOSITO)
      .subscribe((resp: any) => {

        if (resp.ok) {

          this.datos = resp.packing;
          this.packingService.datos = this.datos;

          if (event) {
            event.target.complete();
          }

          this.titulo = 'Packing (' + this.datos.length + ')';

        } else {
          this.uiService.alertaInformativa('No hay pendientes de packing en estos momentos');
          this.navCtrl.navigateRoot('/home', { animated: true });

        }

        this.cargando = false;

      });

  }

  recargar(event) {

    this.cargarPendientes(event);
  }

  nuevoBulto() {
    
    let bulto: any = {};
    
    bulto.DEPOSI = this.usuario.DEPOSITO;
    bulto.USRPCK = this.usuario.USUARIO;

    console.log('Deposito: ' + bulto.DEPOSI);

    
    bulto.CODFOR = 'BUL'+bulto.DEPOSI;
    

    console.log(bulto.CODFOR);

    
    

    this.bultoService.getProximoNumero(bulto.CODFOR).subscribe((resp: any) => {

      console.log(resp);

      if (resp.ok) {

        bulto.NROFOR = String(resp.proximoNumero);
        bulto.FCHMOV = '20203108';
        bulto.ESTADO = 'A';

        console.log('Bulto nuevo: '+ bulto.CODFOR + '-' + bulto.NROFOR);

        this.bultoService.bulto = bulto;
        this.packingService.bulto = bulto;
        this.router.navigateByUrl('packing-clientes');

      }
    });

    
   
  }

  seleccionarItem(bulto: any) {

    this.bultoService.bulto = bulto;
    this.packingService.bulto = bulto;
    this.packingService.item = bulto;
    this.router.navigateByUrl('packing-producto/' + bulto.CODFOR);

  }

  confirmarPacking() {

    this.presentLoading();

    this.packingService.confirmarPacking(this.usuario.USUARIO)
      .subscribe(resp => {

        console.log(resp);

        if (resp.ok) {

          this.cargarPendientes();
          this.procesando.dismiss();
          this.toggle.checked = false;

          // swal("Picking confirmado","Los productos fueron confirmados correctamente","success").then(value => {});
        } else {
          // swal("Error", "No es posible guardar los datos", "error");
          this.procesando.dismiss();
          this.uiService.alertaInformativa('No es posible confirmar packing en estos momentos');
        }
      });
  }


  async presentLoading() {
    this.procesando = await this.loadingController.create({
      message: 'Procesando información'
    });
    return this.procesando.present();
  }

  segmentChanged(event) {

    //    this.pendiente = (this.segment.value === 'pendientes');

  }

  procesarCodigoBarra(codigoBarra: string) {

    if (codigoBarra !== undefined && codigoBarra.length > 0) {

      codigoBarra = codigoBarra.trim();

      this.datos.find(item => {

        item.CODBAR.split('|').find(i => {

          if (i.trim() === codigoBarra) {
            this.seleccionarItem(item);
          }

        });

      });

    } else {
      this.uiService.presentToast('Código de barra vacío');
    }
  }

  scanCode() {

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      this.procesarCodigoBarra(barcodeData.text);

    }).catch(err => {

      console.log('Error', err);
      this.uiService.presentToast('Error leyendo código de barra');
    });
  }

  procesarCodigoManual() {

    this.procesarCodigoBarra(this.codigoManual);
    this.codigoManual = '';

  }

  toggleChanged(event) {
    this.completados = !this.completados;
  }

  verFiltro() {
    this.router.navigateByUrl('filtro-packing');
  }

}
