import File from '../models/File';
import Family from '../models/Family';

class FileController {
  async index(req, res) {
    const files = await File.findAll({
      include: [
        {
          model: Family,
          as: 'family',
          attributes: ['id', 'code', 'welcomeSubject', 'numberTable'],
        },
      ],
    });

    return res.json(files);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { code } = req.params;

    /**
     * If it's a photo image
     */

    if (code) {
      const family = await Family.findOne({
        where: { code },
      });

      if (!family) {
        return res.status(400).json({ error: 'Family not found.' });
      }
      const file = await File.create({
        family_id: family.id,
        name,
        path,
      });

      req.io.emit('photo', {
        family: { code: family.code, subject: family.welcomeSubject },
        file: { url: file.url },
      });

      return res.json(file);
    }

    return res.status(400).json({ error: 'code invalid' });
  }

  async delete(req, res) {
    const { id } = req.params;

    const photo = await File.findByPk(id);

    if (!photo) {
      return res.status(400).json({ error: 'photo not found' });
    }

    await photo.destroy({ where: { id } });

    return res.status(200).json();
  }
}

export default new FileController();
