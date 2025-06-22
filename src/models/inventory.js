'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      inventory.belongsTo(models.profile, {
        foreignKey: 'profile_id',
        as: 'profile',
      });
      inventory.belongsTo(models.item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }
  inventory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id',
      },
    },
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'item',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    
  }, {
    sequelize,
    modelName: 'inventory',
    indexes: [
      {
        unique: true,
        fields: ['profile_id', 'item_id']
      }
    ]
  });
  return inventory;
};