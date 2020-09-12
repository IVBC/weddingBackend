import { Op } from 'sequelize';
import * as Yup from 'yup';

import Family from '../models/Family';
import Guest from '../models/Guest';

class GuestController {
  async index(req, res) {
    const { page = 1, q = '', quantity = 10 } = req.query;

    const { rows: guests, count } = await Guest.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `${q}%`,
        },
      },
      order: [['id', 'DESC']],
      limit: quantity,
      offset: (page - 1) * quantity,

      attributes: ['id', 'name', 'isConfirmed', 'isPresent', 'isChild'],
      include: [
        {
          model: Family,
          as: 'family',

          attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
        },
      ],
    });

    return res.json({
      guests,
      count,
      totalPages: Math.ceil(count / quantity),
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const guest = await Guest.findOne({
      where: {
        id,
      },

      include: [
        {
          model: Family,
          as: 'family',
          attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
        },
      ],
    });

    if (!guest) {
      return res.status(400).json({ error: 'Guest not exists.' });
    }

    return res.json(guest);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      name: Yup.string().required(),
      isConfirmed: Yup.boolean().nullable(),
      isChild: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { code, name, isConfirmed, isChild } = req.body;

    const familyExists = await Family.findOne({
      where: { code },
    });

    if (!familyExists) {
      return res.status(400).json({ error: 'Family not exists.' });
    }

    const guest = await Guest.create({
      name,
      isConfirmed,
      isChild,
      family_id: familyExists.id,
    });

    return res.json(guest);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      family_id: Yup.number(),
      name: Yup.string(),
      isConfirmed: Yup.boolean().nullable(),
      isChild: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const guest = await Guest.findByPk(id);

    if (!guest) {
      return res.status(400).json({ error: 'Guest not found' });
    }
    const { family_id } = req.body;

    if (family_id) {
      const familyExists = await Family.findOne({
        where: { id: family_id },
      });

      if (!familyExists) {
        return res.status(400).json({ error: 'Family not exists.' });
      }
    }

    await guest.update(req.body);

    return res.json(guest);
  }

  async delete(req, res) {
    const { id } = req.params;

    const guest = await Guest.findByPk(id);

    if (!guest) {
      return res.status(400).json({ error: 'Guest not found' });
    }

    await guest.destroy({ where: { id } });

    return res.status(200).json();
  }
}

export default new GuestController();
