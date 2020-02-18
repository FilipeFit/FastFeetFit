import CouriersService from '../services/CouriersService';
import AuthorizationService from '../services/AuthorizationService';

class CouriersController {
  async index(req, res) {
    AuthorizationService.authorize(req, ['admin']);
    const couriers = await CouriersService.index();
    return res.json(couriers);
  }

  async store(req, res) {
    AuthorizationService.authorize(req, ['admin']);
    const { id, name, email } = await CouriersService.save(req, res);
    if (id) {
      return res.json({ id, name, email });
    }
    return null;
  }
}

export default new CouriersController();
