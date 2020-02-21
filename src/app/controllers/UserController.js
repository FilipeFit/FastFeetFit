import * as Yup from 'yup';
import AuthorizationService from '../services/AuthorizationService';

import UserService from '../services/UserService';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });
    AuthorizationService.authorize(req, ['admin']);
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }

    const savedUser = await UserService.save(req, res);

    const { id, name, email, provider } = savedUser;
    if (id) {
      return res.json({ id, name, email, provider });
    }
    return null;
  }
}

export default new UserController();
