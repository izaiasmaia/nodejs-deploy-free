// import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { JWTService } from '../services/index.js';

export const ensureAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;
// console.log(req.headers);

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
  // console.log('Teste atual token: ',jwtData);
  if (jwtData === 'JWT_SECRET_NOT_FOUND') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao verificar o token' }
    });
  } else if (jwtData === 'INVALID TOKEN') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: 'Não autenticado' }
    });
  }
  // console.log('Teste atual: ',jwtData);
  
  req.headers.idUsuario = jwtData.uid.toString();

  return next();
};