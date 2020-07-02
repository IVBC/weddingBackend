import Sequelize, { Model } from 'sequelize';

class Family extends Model {
  static init(sequelize) {
    super.init(
      {
        code: Sequelize.STRING,
        welcomeSubject: Sequelize.STRING,
        numberTable: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Guest, { foreignKey: 'family_id', as: 'guests' }); // Uma familia tem varios convidados.
    this.hasMany(models.File, { foreignKey: 'family_id', as: 'photos' }); // Uma familia tem varias fotos.
  }

  checkCode(code) {
    return code === this.code;
  }
}

export default Family;
