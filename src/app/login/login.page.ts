
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

import { IonContent } from '@ionic/angular/ion-content';
import { IonCard } from '@ionic/angular/ion-card';
import { IonCardHeader } from '@ionic/angular/ion-card-header';
import { IonCardTitle } from '@ionic/angular/ion-card-title';
import { IonCardContent } from '@ionic/angular/ion-card-content';
import { IonItem } from '@ionic/angular/ion-item';
import { IonInput } from '@ionic/angular/ion-input';
import { IonButton } from '@ionic/angular/ion-button';
import { IonText } from '@ionic/angular/ion-text';
import { IonSpinner } from '@ionic/angular/ion-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonSpinner
  ]
})
export class LoginPage {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  async iniciarSesion() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Introduce tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.supabase.login(this.email, this.password);
      await this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión.';
    } finally {
      this.loading = false;
    }
  }
}
