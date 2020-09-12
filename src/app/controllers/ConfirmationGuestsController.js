import * as Yup from 'yup';

import Guest from '../models/Guest';

class ConfirmationGuestsController {
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

    console.log(guests);

    const confirmedGuestsIDs = guests
      .filter(guest => guest.isConfirmed)
      .map(guest => guest.id);

    await Guest.update(
      { isConfirmed: true },
      {
        where: {
          id: confirmedGuestsIDs,
        },
      }
    );

    const notConfirmedGuestsIDs = guests
      .filter(guest => guest.isConfirmed === false)
      .map(guest => guest.id);

    await Guest.update(
      { isConfirmed: false },
      {
        where: {
          id: notConfirmedGuestsIDs,
        },
      }
    );

    const nullConfirmedGuestsIDs = guests
      .filter(guest => guest.isConfirmed === null)
      .map(guest => guest.id);

    await Guest.update(
      { isConfirmed: null },
      {
        where: {
          id: nullConfirmedGuestsIDs,
        },
      }
    );

    // if (!guest) {
    //   return res.status(400).json({ error: 'Guest not found' });
    // }
    // const { family_id } = req.body;

    // if (family_id) {
    //   const familyExists = await Family.findOne({
    //     where: { id: family_id },
    //   });

    //   if (!familyExists) {
    //     return res.status(400).json({ error: 'Family not exists.' });
    //   }
    // }

    // await guest.update(req.body);

    return res.json(guests);
  }
}

export default new ConfirmationGuestsController();
