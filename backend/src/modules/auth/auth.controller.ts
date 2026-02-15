import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../common/middleware';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        data: result,
        message: 'Inicio de sesion exitoso',
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, role, tenantId } = req.body;
      const result = await authService.register(email, password, name, role, tenantId);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Usuario registrado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, avatar } = req.body;
      const user = await authService.updateProfile(req.user!.userId, { name, avatar });

      res.json({
        success: true,
        data: user,
        message: 'Perfil actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user!.userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Contrasena actualizada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
