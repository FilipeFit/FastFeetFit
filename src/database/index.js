import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Role from '../app/models/Role';
import Order from '../app/models/Order';
import Courier from '../app/models/Courier';
import File from '../app/models/File';
import OrderProblem from '../app/models/OrderProblem';

import databaseConfig from '../config/database';

const models = [User, Recipient, Role, Order, Courier, File, OrderProblem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // Iterating into all modules and make the initializations
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
