import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGalleryComponent } from './app-gallery/app-gallery.component';

const routes: Routes = [
  {
     path: '', pathMatch: 'full',
    component: AppGalleryComponent,   // ✅ parent uses component, not loadComponent
    data: { breadcrumb: 'Gallery'},

  },
  {
     path: 'Gallery',
    component: AppGalleryComponent,   // ✅ parent uses component, not loadComponent
    data: { breadcrumb: 'Gallery'},

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
