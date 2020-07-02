import Sequelize, { Model } from 'sequelize';

class Guest extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        isConfirmed: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Family, { foreignKey: 'family_id', as: 'family' }); // Cada convidado havera uma familia.
  }
}

export default Guest;
