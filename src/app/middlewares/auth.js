import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Verifiying if the autorization is informed by the client
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization provided' });
  }

  // Getting the token using desestruturation tecnique
  const [, token] = authHeader.split(' ');
  try {
    // O promisify transforma uma função de callback em uma promise
    // por isso existe um segundo (apóś a função)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Incluindo o userId na requisição depois de logado
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};
