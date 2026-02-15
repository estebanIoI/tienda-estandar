import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from './auth.controller';
import { authenticate } from '../../common/middleware';
import { validateRequest } from '../../utils/validators';

const router: ReturnType<typeof Router> = Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalido'),
    body('password').notEmpty().withMessage('La contrasena es requerida'),
    validateRequest,
  ],
  authController.login.bind(authController)
);

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contrasena debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('role')
      .optional()
      .isIn(['superadmin', 'comerciante', 'vendedor'])
      .withMessage('Rol invalido'),
    validateRequest,
  ],
  authController.register.bind(authController)
);

// GET /api/auth/profile
router.get(
  '/profile',
  authenticate,
  authController.getProfile.bind(authController)
);

// PUT /api/auth/profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacio'),
    body('avatar').optional().isURL().withMessage('URL de avatar invalida'),
    validateRequest,
  ],
  authController.updateProfile.bind(authController)
);

// PUT /api/auth/change-password
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('La contrasena actual es requerida'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('La nueva contrasena debe tener al menos 6 caracteres'),
    validateRequest,
  ],
  authController.changePassword.bind(authController)
);

export default router;
