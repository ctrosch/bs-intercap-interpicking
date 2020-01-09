import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',
    canLoad:[UsuarioGuard]
  },
  {
    path: 'picking',
    loadChildren: './pages/picking/picking.module#PickingPageModule',
    canLoad:[UsuarioGuard]
  },
  { path: 'picking-item/:id', loadChildren: './pages/picking/picking-item/picking-item.module#PickingItemPageModule' },
  { path: 'picking-confirmacion', loadChildren: './pages/picking/picking-confirmacion/picking-confirmacion.module#PickingConfirmacionPageModule' },
  {
    path: 'packing',
    loadChildren: './pages/packing/packing.module#PackingPageModule',
    canLoad:[UsuarioGuard]
  },
  { path: 'packing-producto/:id', loadChildren: './pages/packing/packing-producto/packing-producto.module#PackingProductoPageModule' },
  { path: 'packing-item/:id', loadChildren: './pages/packing/packing-item/packing-item.module#PackingItemPageModule' },
  { path: 'toma-inventario', loadChildren: './pages/toma-inventario/toma-inventario.module#TomaInventarioPageModule' },
  {
    path: 'recepcion',
    loadChildren: './pages/recepcion/recepcion.module#RecepcionPageModule',
    canLoad:[UsuarioGuard]
  },
  { path: 'configuracion', loadChildren: './pages/configuracion/configuracion.module#ConfiguracionPageModule' },
  { path: 'usuario', loadChildren: './pages/usuario/usuario.module#UsuarioPageModule' },   { path: 'packing-item', loadChildren: './pages/packing/packing-item/packing-item.module#PackingItemPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
