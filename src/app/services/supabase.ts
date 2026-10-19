
import { Injectable, signal } from '@angular/core';

import {
  createClient,
  SupabaseClient,
  User
} from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  // Usuario y rol de la sesión actual
  currentUser = signal<User | null>(null);
  userRole = signal<'admin' | 'user' | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.initSession();
  }

  // ------------------------------------
  // AUTENTICACIÓN
  // ------------------------------------

  // Recuperar la sesión guardada
  async initSession() {
    const { data: { session }, error } =
      await this.supabase.auth.getSession();

    if (error) throw error;

    if (session?.user) {
      this.currentUser.set(session.user);
      await this.loadRole(session.user.id);
    }
  }

  // Iniciar sesión con email y contraseña
  async login(email: string, password: string) {
    const { data, error } =
      await this.supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) throw error;

    if (data.user) {
      this.currentUser.set(data.user);
      await this.loadRole(data.user.id);
    }
  }

  // Cerrar sesión
  async logout() {
    const { error } = await this.supabase.auth.signOut();

    if (error) throw error;

    this.currentUser.set(null);
    this.userRole.set(null);
  }

  // Consultar el rol del usuario
  async loadRole(userId: string) {
    this.userRole.set(null);

    const { data, error } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    this.userRole.set(data.role);
  }

  // ------------------------------------
  // CRUD DE CLIENTES
  // ------------------------------------

  // Obtener todos los clientes
  async getClients() {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  // Crear un cliente
  async createClient(client: {
    nombre: string;
    empresa: string;
    email: string;
  }) {
    const { error } = await this.supabase
      .from('clients')
      .insert([client]);

    if (error) throw error;
  }

  // Actualizar un cliente
  async updateClient(
    id: string,
    client: {
      nombre: string;
      empresa: string;
      email: string;
    }
  ) {
    const { error } = await this.supabase
      .from('clients')
      .update(client)
      .eq('id', id);

    if (error) throw error;
  }

  // Eliminar un cliente
  async deleteClient(id: string) {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ------------------------------------
  // SUPABASE STORAGE - GALERÍA
  // ------------------------------------

  // Obtener las imágenes del bucket "imagenes"
  async getImages(): Promise<{
    name: string;
    url: string;
  }[]> {

    const { data, error } = await this.supabase.storage
      .from('imagenes')
      .list('', {
        limit: 100,
        sortBy: {
          column: 'name',
          order: 'asc'
        }
      });

    if (error) throw error;

    // Filtrar únicamente archivos de imagen
    const archivos = (data || []).filter(
      file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
    );

    // Generar la URL pública de cada imagen
    return archivos.map(file => {

      const { data: publicData } = this.supabase.storage
        .from('imagenes')
        .getPublicUrl(file.name);

      return {
        name: file.name,
        url: publicData.publicUrl
      };
    });
  }
}
