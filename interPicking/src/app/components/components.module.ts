import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { ItemProductoComponent } from './item-producto/item-producto.component';
import { ItemProductoCantidadComponent } from './item-producto-cantidad/item-producto-cantidad.component';




@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent, 
    ItemProductoComponent,
    ItemProductoCantidadComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    ItemProductoComponent,
    ItemProductoCantidadComponent
  ]
})
export class ComponentsModule { }
