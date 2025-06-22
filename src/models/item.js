'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      item.hasMany(models.inventory, {
        foreignKey: 'item_id',
        as: 'inventories',
      });
      item.belongsToMany(models.shop, {
        through: 'shop_items',
        foreignKey: 'item_id',
        otherKey: 'shop_id',
        as: 'shops',
      });
      item.belongsToMany(models.profile, {
        through: models.inventory,
        foreignKey: 'item_id',
        otherKey: 'profile_id',
        as: 'profiles',
      });
      item.hasMany(models.shop_item, {
        foreignKey: 'item_id',
        as: 'shop_list',
      });
    }
  }
  item.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('equipment', 'consumable', 'material'),
      allowNull: false,
    },
    base_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};