
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
import { IonItem } from '@ionic/angular/ion-item';
import { IonInput } from '@ionic/angular/ion-input';
import { IonList } from '@ionic/angular/ion-list';
import { IonLabel } from '@ionic/angular/ion-label';
import { IonSpinner } from '@ionic/angular/ion-spinner';

interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  created_at?: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonList,
    IonLabel,
    IonSpinner
  ]
})
export class ClientesPage implements OnInit {

  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  editandoId: string | null = null;

  currentUser = this.supabase.currentUser;
  userRole = this.supabase.userRole;

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    empresa: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.cargarClientes();
  }

  async cargarClientes() {
    this.cargando = true;
    this.error = '';

    try {
      this.clientes = await this.supabase.getClients();
    } catch (e: any) {
      this.error = e.message || 'Error al cargar clientes';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async guardarCliente() {
    if (
      this.formulario.invalid ||
      this.userRole() !== 'admin' ||
      this.guardando
    ) {
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    const datos = {
      nombre: this.formulario.value.nombre!,
      empresa: this.formulario.value.empresa!,
      email: this.formulario.value.email!
    };

    try {
      if (this.editandoId) {
        await this.supabase.updateClient(this.editandoId, datos);
        this.mensaje = 'Cliente actualizado correctamente';
      } else {
        await this.supabase.createClient(datos);
        this.mensaje = 'Cliente añadido correctamente';
      }

      this.cancelarEdicion();
      await this.cargarClientes();

    } catch (e: any) {
      this.error = e.message || 'Error al guardar el cliente';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }

  editarCliente(cliente: Cliente) {
    if (this.userRole() !== 'admin') return;

    this.editandoId = cliente.id;

    this.formulario.patchValue({
      nombre: cliente.nombre,
      empresa: cliente.empresa,
      email: cliente.email
    });
  }

  async eliminarCliente(cliente: Cliente) {
    if (this.userRole() !== 'admin') return;

    const confirmado = window.confirm(
      `¿Quieres eliminar a ${cliente.nombre}?`
    );

    if (!confirmado) return;

    this.error = '';
    this.mensaje = '';

    try {
      await this.supabase.deleteClient(cliente.id);
      this.mensaje = 'Cliente eliminado correctamente';
      await this.cargarClientes();
    } catch (e: any) {
      this.error = e.message || 'Error al eliminar';
    } finally {
      this.cdr.detectChanges();
    }
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.formulario.reset();
  }

  irLogin() {
    this.router.navigateByUrl('/login');
  }

  volver() {
    this.router.navigateByUrl('/home');
  }
}
