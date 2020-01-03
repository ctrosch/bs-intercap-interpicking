import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'picking', loadChildren: './pages/picking/picking.module#PickingPageModule' },
  { path: 'picking-item/:id', loadChildren: './pages/picking/picking-item/picking-item.module#PickingItemPageModule' },
  { path: 'picking-confirmacion', loadChildren: './pages/picking/picking-confirmacion/picking-confirmacion.module#PickingConfirmacionPageModule' },
  { path: 'packing', loadChildren: './pages/packing/packing.module#PackingPageModule' },  
  { path: 'toma-inventario', loadChildren: './pages/toma-inventario/toma-inventario.module#TomaInventarioPageModule' },
  { path: 'recepcion', loadChildren: './pages/recepcion/recepcion.module#RecepcionPageModule' },  
  { path: 'configuracion', loadChildren: './pages/configuracion/configuracion.module#ConfiguracionPageModule' },
  { path: 'usuario', loadChildren: './pages/usuario/usuario.module#UsuarioPageModule' }  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
