
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SupabaseService } from '../services/supabase';

import { IonHeader } from '@ionic/angular/ion-header';
import { IonToolbar } from '@ionic/angular/ion-toolbar';
import { IonTitle } from '@ionic/angular/ion-title';
import { IonContent } from '@ionic/angular/ion-content';
import { IonButton } from '@ionic/angular/ion-button';
import { IonCard } from '@ionic/angular/ion-card';
import { IonCardHeader } from '@ionic/angular/ion-card-header';
import { IonCardTitle } from '@ionic/angular/ion-card-title';
import { IonCardContent } from '@ionic/angular/ion-card-content';
import { IonImg } from '@ionic/angular/ion-img';
import { IonSpinner } from '@ionic/angular/ion-spinner';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonSpinner
  ]
})
export class GaleriaPage implements OnInit {

  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  imagenes: { name: string; url: string }[] = [];
  cargando = true;
  error = '';

  ngOnInit() {
    this.cargarImagenes();
  }

  async cargarImagenes() {
    this.cargando = true;
    this.error = '';

    try {
      const resultado = await this.supabase.getImages();

      console.log('Imágenes recibidas:', resultado);

      this.imagenes = resultado;

    } catch (e: any) {
      console.error('Error en galería:', e);
      this.error = e.message || 'Error al cargar imágenes';

    } finally {
      this.cargando = false;

      // Forzar actualización de la interfaz
      this.cdr.detectChanges();
    }
  }

  volver() {
    this.router.navigateByUrl('/home');
  }
}
