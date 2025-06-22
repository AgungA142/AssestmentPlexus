'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shop_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shop_item.belongsTo(models.shop, {
        foreignKey: 'shop_id',
        as: 'shop',
      });
      shop_item.belongsTo(models.item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }
  shop_item.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'shop',
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'shop_item',
  });
  return shop_item;
};