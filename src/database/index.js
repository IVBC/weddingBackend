import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Family from '../app/models/Family';
import Guest from '../app/models/Guest';
import File from '../app/models/File';

const models = [Family, Guest, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
