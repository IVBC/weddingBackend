// import { Op } from 'sequelize';
import * as Yup from 'yup';

import Family from '../models/Family';

class FamilyController {
  async index(req, res) {
    const { page = 1, quantity = 10 } = req.query;

    const { rows: families, count } = await Family.findAndCountAll({
      order: [['id', 'DESC']],
      limit: quantity,
      offset: (page - 1) * quantity,
      attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
    });

    return res.json({
      families,
      count,
      totalPages: Math.ceil(count / quantity),
    });
  }

  async show(req, res) {
    const { code } = req.params;

    const family = await Family.findOne({
      where: {
        code,
      },
      attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
      include: [
        {
          association: 'photos',
          attributes: {
            include: [['id', 'id_file']],
            exclude: ['updatedAt', 'createdAt', 'family_id', 'id'],
          },
        },
      ],
    });

    if (!family) {
      return res.status(400).json({ error: 'Family not exists.' });
    }

    return res.json(family);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      welcomeSubject: Yup.string().required(),
      numberTable: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validate fails.' });
    }
    const familyExists = await Family.findOne({
      where: { code: req.body.code },
    });

    if (familyExists) {
      return res.status(400).json({ error: 'Code Family already exists' });
    }

    const { id, code, welcomeSubject, numberTable } = await Family.create(
      req.body
    );

    return res.json({
      id,
      code,
      welcomeSubject,
      numberTable,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      welcomeSubject: Yup.string(),
      numberTable: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validate fails.' });
    }
    const { code } = req.params;

    const family = await Family.findOne({
      where: { code },
    });

    if (!family) {
      return res.status(401).json({ error: 'Family not found.' });
    }

    const {
      id,
      code: _code,
      welcomeSubject,
      numberTable,
    } = await family.update(req.body);

    return res.json({
      id,
      code: _code,
      welcomeSubject,
      numberTable,
    });
  }

  async delete(req, res) {
    const { code } = req.params;

    const family = await Family.findOne({
      where: { code },
    });

    if (!family) {
      return res.status(401).json({ error: 'Family not found.' });
    }

    await family.destroy({ where: { code } });

    return res.status(200).json();
  }
}

export default new FamilyController();
