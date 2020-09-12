module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('guests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      family_id: {
        type: Sequelize.INTEGER,
        references: { model: 'families', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      is_present: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_child: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('guests');
  },
};
