import Sequelize, { Model } from 'sequelize';

class Role extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        role: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: 'userRoles',
      as: 'users',
      foreignKey: 'roleId'
    });
  }
}

export default Role;
