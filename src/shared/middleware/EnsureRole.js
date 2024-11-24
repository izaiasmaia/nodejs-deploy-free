import { StatusCodes } from 'http-status-codes';

import { JWTService } from '../services/index.js';

export const ensureHasRole = (allowedRoles) => (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' }
      });
    }
  
    const [type, token] = authorization.split(' ');
  
    if (type !== 'Bearer') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' }
      });
    }
  
    const jwtData = JWTService.verify(token);
    
    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: 'Erro ao verificar o token' }
      });
    } else if (jwtData === 'INVALID_TOKEN') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errors: { default: 'Não autenticado' }
      });
    }
  
    const userRole = jwtData.role;
    
    // Verificar se o usuário tem uma das roles permitidas
    if (!allowedRoles.includes(userRole)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        errors: { default: 'Usuário sem permissão para acessar a página requerida!' }
      });
    }
  
    req.headers.idUsuario = jwtData.uid.toString();
    req.headers.userRole = userRole;
  
    return next();
  };
  