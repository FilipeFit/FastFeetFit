import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User';
import Role from '../models/Role';

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
    // Including the userId in the request after the login
    req.userId = decoded.id;
    // Finding the user Roles and add them to the request
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['role']
        }
      ]
    });
    const requestRoles = [];
    const userRoles = user.roles;
    userRoles.forEach(userRole => {
      requestRoles.push(userRole.role);
    });
    req.roles = requestRoles;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};
