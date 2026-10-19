
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SupabaseService } from '../services/supabase';

import { IonHeader } from '@ionic/angular/ion-header';
import { IonToolbar } from '@ionic/angular/ion-toolbar';
import { IonTitle } from '@ionic/angular/ion-title';
import { IonContent } from '@ionic/angular/ion-content';
import { IonCard } from '@ionic/angular/ion-card';
import { IonCardHeader } from '@ionic/angular/ion-card-header';
import { IonCardTitle } from '@ionic/angular/ion-card-title';
import { IonCardContent } from '@ionic/angular/ion-card-content';
import { IonButton } from '@ionic/angular/ion-button';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class HomePage {

  private router = inject(Router);
  private supabase = inject(SupabaseService);

  currentUser = this.supabase.currentUser;
  userRole = this.supabase.userRole;

  // Ir a la pantalla de login
  irLogin() {
    this.router.navigateByUrl('/login');
  }

  // Ir a la galería de imágenes
  irGaleria() {
    this.router.navigateByUrl('/galeria');
  }

  irClientes() {
  this.router.navigateByUrl('/clientes');
}

  // Cerrar sesión
  async cerrarSesion() {
    await this.supabase.logout();
    await this.router.navigateByUrl('/home');

  }
}
