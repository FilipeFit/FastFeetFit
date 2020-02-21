import OrderProblem from '../models/OrderProblem';
import Order from '../models/Order';

class OrderProblemService {
  async save(req, res) {
    const order = await Order.findByPk(req.params.id);
    if (!order || order.canceled_at !== null || order.end_date !== null) {
      return res.status(400).json({
        error: 'This order is not available, canceled or already delivered'
      });
    }
    const orderProblem = {
      order_id: req.params.id,
      description: req.body.description
    };
    const savedOrderProblem = await OrderProblem.create(orderProblem);
    return savedOrderProblem;
  }

  async indexByOrder(req) {
    const orders = await OrderProblem.findAll({
      where: { order_id: req.params.id }
    });
    return orders;
  }
}

export default new OrderProblemService();
