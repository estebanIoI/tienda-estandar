import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config, db } from '../../config';
import { JWTPayload, UserRole } from '../types';
import { RowDataPacket } from 'mysql2';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token de autenticacion no proporcionado',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Verify user is still active
    const [userRows] = await db.execute<RowDataPacket[]>(
      'SELECT is_active FROM users WHERE id = ?',
      [decoded.userId]
    );
    if (userRows.length === 0 || !userRows[0].is_active) {
      res.status(403).json({
        success: false,
        error: 'Tu cuenta ha sido desactivada',
      });
      return;
    }

    // Verify tenant is still active (for non-superadmin)
    if (decoded.tenantId && decoded.role !== 'superadmin') {
      const [tenantRows] = await db.execute<RowDataPacket[]>(
        'SELECT status FROM tenants WHERE id = ?',
        [decoded.tenantId]
      );
      if (tenantRows.length > 0 && tenantRows[0].status !== 'activo') {
        res.status(403).json({
          success: false,
          error: 'Tu comercio ha sido suspendido. Contacta al administrador.',
        });
        return;
      }
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Token invalido o expirado',
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta accion',
      });
      return;
    }

    next();
  };
};
