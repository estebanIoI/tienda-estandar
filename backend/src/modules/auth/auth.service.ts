import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db, config } from '../../config';
import { User, JWTPayload, UserRole } from '../../common/types';
import { AppError } from '../../common/middleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: string;
  tenant_id: string | null;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class AuthService {
  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      throw new AppError('Credenciales invalidas', 401);
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Credenciales invalidas', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Tu cuenta ha sido desactivada. Contacta al administrador.', 403);
    }

    // Check if tenant is active (for non-superadmin users)
    if (user.tenant_id && user.role !== 'superadmin') {
      const [tenantRows] = await db.execute<RowDataPacket[]>(
        'SELECT status FROM tenants WHERE id = ?',
        [user.tenant_id]
      );
      if (tenantRows.length > 0 && tenantRows[0].status !== 'activo') {
        throw new AppError('Tu comercio ha sido suspendido. Contacta al administrador de la plataforma.', 403);
      }
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    return {
      user: {
        id: user.id,
        tenantId: user.tenant_id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || undefined,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole = 'vendedor',
    tenantId?: string | null
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Verificar si el email ya existe
    const [existing] = await db.execute<UserRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      throw new AppError('El email ya esta registrado', 400);
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute<ResultSetHeader>(
      'INSERT INTO users (id, tenant_id, email, password, name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, tenantId || null, email, hashedPassword, name, role]
    );

    const payload: JWTPayload = {
      userId: id,
      email,
      role,
      tenantId: tenantId || null,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    return {
      user: {
        id,
        tenantId: tenantId || null,
        email,
        name,
        role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token,
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT id, tenant_id, email, name, role, avatar, is_active, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const user = rows[0];
    return {
      id: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || undefined,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async updateProfile(
    userId: string,
    data: { name?: string; avatar?: string }
  ): Promise<Omit<User, 'password'>> {
    const updates: string[] = [];
    const values: (string | undefined)[] = [];

    if (data.name) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.avatar) {
      updates.push('avatar = ?');
      values.push(data.avatar);
    }

    if (updates.length === 0) {
      throw new AppError('No hay datos para actualizar', 400);
    }

    values.push(userId);

    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getProfile(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const isValidPassword = await bcrypt.compare(currentPassword, rows[0].password);

    if (!isValidPassword) {
      throw new AppError('Contrasena actual incorrecta', 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
  }
}

export const authService = new AuthService();
