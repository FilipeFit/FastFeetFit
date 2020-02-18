import Courier from '../models/Courier';
import Order from '../models/Order';

class CouriersService {
  async save(req, res) {
    const isCourierAlreadyExists = await Courier.findOne({
      where: {
        email: req.body.email
      }
    });
    if (isCourierAlreadyExists) {
      return res.status(400).json({ error: 'Courier already exists' });
    }
    const savedCourier = await Courier.create(req.body);
    return savedCourier;
  }

  async update(req, res) {
    const { email } = req.body;
    const courier = await Courier.findByPk(req.params.id);

    if (email && email !== courier.email) {
      const courierExists = await Courier.findOne({ where: { email } });

      if (courierExists) {
        return res.status(400).json({ error: 'Courier already exists' });
      }
    }
    const savedCourier = await courier.update(req.body);
    return savedCourier;
  }

  async delete(req, res) {
    const isCourirHaveOrders = Order.findOne({
      where: {
        courier_id: req.params.id
      }
    });
    if (isCourirHaveOrders) {
      res.status(400).json({
        error: 'This Courier Already have a order impossible to delete '
      });
    }
    const courier = Courier.findByPk(req.params.id);
    courier.delete();
    return res.status(204);
  }

  async index() {
    const couriers = await Courier.findAll();
    return couriers;
  }
}

export default new CouriersService();
