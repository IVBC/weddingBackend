import * as Yup from 'yup';

import Guest from '../models/Guest';

class SetPresentGuestsController {
  async update(req, res) {
    const schema = Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        isConfirmed: Yup.boolean().nullable(),
        isChild: Yup.boolean(),
        isPresent: Yup.boolean(),
        id: Yup.number().required('guest id is required'),
      })
    );

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const guests = req.body;

    const presentGuestsIDs = guests
      .filter(guest => guest.isPresent)
      .map(guest => guest.id);

    await Guest.update(
      { isPresent: true },
      {
        where: {
          id: presentGuestsIDs,
        },
      }
    );

    const notPresentGuestsIDs = guests
      .filter(guest => !guest.isPresent)
      .map(guest => guest.id);

    await Guest.update(
      { isPresent: false },
      {
        where: {
          id: notPresentGuestsIDs,
        },
      }
    );

    return res.json(guests);
  }
}

export default new SetPresentGuestsController();
