'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shop.hasMany(models.shop_item, {
        foreignKey: 'shop_id',
        as: 'shop_items',
      });
    }
  }
  shop.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shop_type: {
      type: DataTypes.ENUM('general','equipment','consumable','material'),
      allowNull: false,
    },
    
  }, {
    sequelize,
    modelName: 'shop',
  });
  return shop;
};