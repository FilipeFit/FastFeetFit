import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';

import AuthorizationService from '../services/AuthorizationService';
import OrdersService from '../services/OrdersService';

class OrdersController {
  async store(req, res) {
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }

    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const { id, recipient_id, courier_id, product } = await OrdersService.save(
      req,
      res
    );

    const order = await OrdersService.getOrderDetails(id);

    await Queue.add(NewOrderMail.key, {
      order
    });

    if (id) {
      return res.json({ id, recipient_id, courier_id, product });
    }
    return null;
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      product: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const savedOrder = await OrdersService.update(req, res);
    const { id, recipient_id, courier_id, product } = savedOrder;
    if (id) {
      return res.json({ id, recipient_id, courier_id, product });
    }
    return null;
  }

  async delete(req, res) {
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const {
      id,
      recipient_id,
      courier_id,
      product,
      canceled_at
    } = await OrdersService.cancel(req, res);
    if (id) {
      return res.json({ id, recipient_id, courier_id, product, canceled_at });
    }
    return null;
  }

  async start(req, res) {
    if (!AuthorizationService.authorize(req, ['courier'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const {
      id,
      recipient_id,
      courier_id,
      product,
      start_date
    } = await OrdersService.start(req, res);
    if (id) {
      return res.json({ id, recipient_id, courier_id, product, start_date });
    }
    return null;
  }

  async deliver(req, res) {
    if (!AuthorizationService.authorize(req, ['courier'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const {
      id,
      recipient_id,
      courier_id,
      product,
      start_date,
      end_date,
      signature_id
    } = await OrdersService.deliver(req, res);
    if (id) {
      return res.json({
        id,
        recipient_id,
        courier_id,
        product,
        start_date,
        end_date,
        signature_id
      });
    }
    return null;
  }

  async indexActiveByCourier(req, res) {
    if (!AuthorizationService.authorize(req, ['courier', 'admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }

    const orders = await OrdersService.indexActiveByCourier(req);

    return res.json(orders);
  }

  async indexAllCourierOrders(req, res) {
    if (!AuthorizationService.authorize(req, ['courier', 'admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const orders = await OrdersService.indexAllCourierOrders(req);

    return res.json(orders);
  }
}

export default new OrdersController();
