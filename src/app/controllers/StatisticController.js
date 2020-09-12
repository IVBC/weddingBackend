import { fn, col } from 'sequelize';
import * as Yup from 'yup';

import Family from '../models/Family';
import Guest from '../models/Guest';

class StatisticController {
  async index(req, res) {
    const { rows: guests, count: total } = await Guest.findAndCountAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'isConfirmed', 'isPresent', 'isChild'],
      include: [
        {
          model: Family,
          as: 'family',
          where: {
            isReceptionist: false,
          },
          attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
        },
      ],
    });

    const countChilds = guests.reduce((acm, guest) => {
      return guest.isChild ? acm + 1 : acm;
    }, 0);

    const presents = guests.reduce((acm, guest) => {
      return guest.isPresent ? acm + 1 : acm;
    }, 0);
    const absents = total - presents;

    const tables = await Family.findAll({
      where: {
        isReceptionist: false,
      },
      attributes: [[fn('DISTINCT', col('number_table')), 'numberTable']],
      order: [['numberTable', 'ASC']],
    });

    const statisticTables = tables.reduce((allTables, { numberTable }) => {
      const guestsFilters = guests.filter(
        guest => guest.family.numberTable === numberTable
      );
      const totalTable = guestsFilters.length;
      const countChildsTable = guestsFilters.reduce((acm, guest) => {
        return guest.isChild ? acm + 1 : acm;
      }, 0);

      const presentsTable = guestsFilters.reduce((acm, guest) => {
        return guest.isPresent ? acm + 1 : acm;
      }, 0);
      const absentsTable = totalTable - presentsTable;
      const dataTable = {
        numberTable,
        countChilds: countChildsTable,
        absents: absentsTable,
        total: totalTable,
        presents: presentsTable,
      };
      allTables.push(dataTable);
      return allTables;
    }, []);

    return res.json({
      total,
      presents,
      countChilds,
      absents,
      statisticTables,
    });
  }

  async show(req, res) {
    const { numberTable } = req.params;
    const { rows: guests, count: total } = await Guest.findAndCountAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'isConfirmed', 'isPresent', 'isChild'],
      include: [
        {
          model: Family,
          as: 'family',
          where: {
            isReceptionist: false,
            numberTable,
          },
          attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
        },
      ],
    });

    const countChilds = guests.reduce((acm, guest) => {
      return guest.isChild ? acm + 1 : acm;
    }, 0);

    const presents = guests.reduce((acm, guest) => {
      return guest.isPresent ? acm + 1 : acm;
    }, 0);
    const absents = total - presents;

    return res.json({
      total,
      presents,
      countChilds,
      absents,
      guests,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      welcomeSubject: Yup.string().required(),
      numberTable: Yup.number().required(),
      isReceptionist: Yup.boolean(),
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

    const {
      id,
      code,
      welcomeSubject,
      numberTable,
      isReceptionist,
    } = await Family.create(req.body);

    return res.json({
      id,
      code,
      welcomeSubject,
      numberTable,
      isReceptionist,
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
      isReceptionist,
    } = await family.update(req.body);

    return res.json({
      id,
      code: _code,
      welcomeSubject,
      numberTable,
      isReceptionist,
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

export default new StatisticController();
