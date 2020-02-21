import AuthorizationService from '../services/AuthorizationService';
import OrderProblemService from '../services/OrderProblemService';

class OrderProblemController {
  async store(req, res) {
    if (!AuthorizationService.authorize(req, ['courier', 'admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const { id, order_id, description } = await OrderProblemService.save(
      req,
      res
    );
    if (id) {
      return res.json({ id, order_id, description });
    }
    return null;
  }

  async indexByOrder(req, res) {
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const orders = await OrderProblemService.indexByOrder(req);
    return res.json(orders);
  }
}

export default new OrderProblemController();
