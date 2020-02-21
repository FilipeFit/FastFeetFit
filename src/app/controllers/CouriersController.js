import * as Yup from 'yup';

import CouriersService from '../services/CouriersService';
import AuthorizationService from '../services/AuthorizationService';

class CouriersController {
  async index(req, res) {
    AuthorizationService.authorize(req, ['admin']);
    const couriers = await CouriersService.index();
    return res.json(couriers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }
    AuthorizationService.authorize(req, ['admin']);
    const { id, name, email } = await CouriersService.save(req, res);
    if (id) {
      return res.json({ id, name, email });
    }
    return null;
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }
    AuthorizationService.authorize(req, ['admin']);
    const savedCourier = await CouriersService.update(req, res);
    const { id, name, email, avatar_id } = savedCourier;
    if (id) {
      return res.json({ id, name, email, avatar_id });
    }
    return null;
  }

  async delete(req, res) {
    AuthorizationService.authorize(req, ['admin']);
    const isCourierDeleted = await CouriersService.delete(req, res);
    if (isCourierDeleted) {
      return res.status(204).json();
    }
    return null;
  }
}

export default new CouriersController();
