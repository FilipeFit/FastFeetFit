import { getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Courier from '../models/Courier';
import Recipient from '../models/Recipient';

class OrderService {
  async save(req, res) {
    const isCourierValid = await Courier.findByPk(req.body.courier_id);
    if (!isCourierValid) {
      return res.status(400).json({ error: 'This Courier is not available' });
    }

    const isRecipientValid = await Recipient.findByPk(req.body.recipient_id);
    if (!isRecipientValid) {
      return res.status(400).json({ error: 'This Recipient is not available' });
    }

    const savedOrder = await Order.create(req.body);

    return savedOrder;
  }

  async update(req, res) {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        start_date: null,
        canceled_at: null
      }
    });
    if (!order) {
      return res.status(400).json({
        error:
          'Order not available to be changed, already delivered or canceled'
      });
    }
    const isCourierValid = await Courier.findByPk(req.body.courier_id);
    if (!isCourierValid) {
      return res.status(400).json({ error: 'This Courier is not available' });
    }

    const isRecipientValid = await Recipient.findByPk(req.body.recipient_id);
    if (!isRecipientValid) {
      return res.status(400).json({ error: 'This Recipient is not available' });
    }
    const savedOrder = await order.update(req.body);
    return savedOrder;
  }

  async cancel(req, res) {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        start_date: null,
        canceled_at: null
      }
    });
    if (!order) {
      return res
        .status(400)
        .json({ error: 'Order not available, already delivered or canceled' });
    }
    const savedOrder = await order.update({ canceled_at: new Date() });
    return savedOrder;
  }

  async indexActiveByCourier(req) {
    const orders = await Order.findAll({
      where: {
        courier_id: req.params.courierId,
        canceled_at: null,
        start_date: null
      }
    });
    return orders;
  }

  async indexAllCourierOrders(req) {
    const orders = await Order.findAll({
      where: {
        courier_id: req.params.courierId
      }
    });
    return orders;
  }

  async start(req, res) {
    const order = await Order.findByPk(req.body.id);
    if (!order || order.start_date !== null || order.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'The order is not available to be started' });
    }

    const hourNow = getHours(new Date());
    if (hourNow < 8 || hourNow > 18) {
      return res
        .status(400)
        .json({ error: 'Orders can start only beteween 8 and 18 hours' });
    }

    const currentDate = Number(new Date());
    const { count } = await Order.findAndCountAll({
      where: {
        courier_id: order.courier_id,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)]
        }
      }
    });
    if (count >= 5) {
      return res
        .status(400)
        .json({ error: 'You can deliver only 5 orders a day' });
    }
    const savedOrder = await order.update({ start_date: new Date() });
    return savedOrder;
  }

  async deliver(req, res) {
    const order = await Order.findByPk(req.body.id);
    if (!order || order.start_date === null || order.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'The order is not available to be delivered' });
    }

    const savedOrder = await order.update({
      end_date: new Date(),
      signature_id: req.body.signature_id
    });
    return savedOrder;
  }

  async getOrderDetails(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'email']
        }
      ]
    });
    return order;
  }
}

export default new OrderService();
