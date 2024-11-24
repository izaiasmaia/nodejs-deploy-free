// import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { obterConexaoDoPool, sqlExecute } from '../../config/db.js';
// import * as yup from 'yup';


import { JWTService, PasswordCrypto } from '../../shared/services/index.js';
// import { validation } from '../../shared/middleware';
// import { IUsuario } from '../../database/models';
import Login from './../../Models/loginModel.js';


export const signIn = async (req, res) => {
  const { email, senha } = req.body;

  const conn = await obterConexaoDoPool();
  const query = await Login.getByEmail(email)
  const [[usuario]] = await sqlExecute(conn, query);

  if (usuario === null || usuario === undefined) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email não cadastrado'
      }
    });
  }
  if (usuario instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha são inválidos'
      }
    });
  }

  console.log(senha, usuario.SENHA);
  const passwordMatch = await PasswordCrypto.verifyPassword(senha, usuario.SENHA);

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha são inválidos'
      }
    });
  } else {

    const accessToken = JWTService.signIn({ uid: usuario.ID, role: usuario.PERFIL });
    if (accessToken === 'JWT_SECRET_NOT_FOUND') {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: 'Erro ao gerar o token de acesso'
        }
      });
    }

    return res.status(StatusCodes.OK).json({ accessToken });
  }
};