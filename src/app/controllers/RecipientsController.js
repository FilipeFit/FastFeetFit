import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import AuthorizationService from '../services/AuthorizationService';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      state: Yup.string()
        .required()
        .min(2)
        .max(2),
      city: Yup.string().required(),
      cep: Yup.string().required()
    });
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }

    const isRecipientAlreadyExists = await Recipient.findOne({
      where: { name: req.body.name }
    });

    if (isRecipientAlreadyExists) {
      return res
        .status(400)
        .json({ error: 'Recipient already in the database' });
    }
    const {
      name,
      street,
      number,
      complment,
      state,
      city,
      cep
    } = await Recipient.create(req.body);
    return res.json({ name, street, number, complment, state, city, cep });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      state: Yup.string()
        .required()
        .min(2)
        .max(2),
      city: Yup.string().required(),
      cep: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'schama is not valid' });
    }
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }

    const { name } = req.body;
    const recipient = await Recipient.findByPk(req.params.id);
    if (name && name !== recipient.name) {
      const isRecipientAlreadyExists = await Recipient.findOne({
        where: { name }
      });
      if (isRecipientAlreadyExists) {
        return res
          .status(400)
          .json({ error: 'Recipient already in the database' });
      }
    }
    const {
      street,
      number,
      complment,
      state,
      city,
      cep
    } = await recipient.update(req.body);
    return res.json({ name, street, number, complment, state, city, cep });
  }
}

export default new RecipientsController();
