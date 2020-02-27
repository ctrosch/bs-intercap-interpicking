import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  version: string;

  constructor(private appVersion: AppVersion) { 

    this.appVersion.getVersionNumber().then(value => {
      this.version = value;
    }).catch(err => {
      alert(err);
    });


  }

  ngOnInit() {
  }

}
