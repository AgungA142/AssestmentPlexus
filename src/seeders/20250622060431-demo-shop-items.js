'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const items = [];
    
    const equipmentItems = [
      { name: 'Iron Sword', description: 'A sturdy iron sword', type: 'equipment', base_price: 100 },
      { name: 'Steel Shield', description: 'A reliable steel shield', type: 'equipment', base_price: 80 },
      { name: 'Leather Armor', description: 'Basic leather protection', type: 'equipment', base_price: 120 },
      { name: 'Magic Staff', description: 'A staff imbued with magic', type: 'equipment', base_price: 150 },
      { name: 'Silver Bow', description: 'An elegant silver bow', type: 'equipment', base_price: 110 },
      { name: 'Chain Mail', description: 'Flexible chain armor', type: 'equipment', base_price: 200 },
      { name: 'War Hammer', description: 'A powerful war hammer', type: 'equipment', base_price: 130 },
      { name: 'Mystic Robe', description: 'Robes for magic users', type: 'equipment', base_price: 90 },
      { name: 'Dragon Helm', description: 'Helmet made from dragon scales', type: 'equipment', base_price: 250 },
      { name: 'Elven Boots', description: 'Light and swift boots', type: 'equipment', base_price: 70 }
    ];

    const consumableItems = [
      { name: 'Health Potion', description: 'Restores health points', type: 'consumable', base_price: 25 },
      { name: 'Mana Potion', description: 'Restores mana points', type: 'consumable', base_price: 30 },
      { name: 'Stamina Elixir', description: 'Boosts stamina temporarily', type: 'consumable', base_price: 35 },
      { name: 'Antidote', description: 'Cures poison effects', type: 'consumable', base_price: 20 },
      { name: 'Strength Brew', description: 'Increases strength temporarily', type: 'consumable', base_price: 40 },
      { name: 'Speed Potion', description: 'Increases movement speed', type: 'consumable', base_price: 35 },
      { name: 'Invisibility Potion', description: 'Makes you invisible briefly', type: 'consumable', base_price: 100 },
      { name: 'Fire Resistance Potion', description: 'Protects against fire damage', type: 'consumable', base_price: 50 },
      { name: 'Healing Salve', description: 'Gradual health recovery', type: 'consumable', base_price: 15 },
      { name: 'Energy Drink', description: 'Restores energy quickly', type: 'consumable', base_price: 25 }
    ];

    const materialItems = [
      { name: 'Iron Ore', description: 'Raw iron for crafting', type: 'material', base_price: 10 },
      { name: 'Wood Log', description: 'Quality wood for crafting', type: 'material', base_price: 5 },
      { name: 'Leather Hide', description: 'Animal hide for armor making', type: 'material', base_price: 15 },
      { name: 'Magic Crystal', description: 'Crystal infused with magic', type: 'material', base_price: 50 },
      { name: 'Silver Ingot', description: 'Refined silver bar', type: 'material', base_price: 25 },
      { name: 'Dragon Scale', description: 'Rare dragon scale material', type: 'material', base_price: 100 },
      { name: 'Herb Bundle', description: 'Collection of useful herbs', type: 'material', base_price: 8 },
      { name: 'Gemstone', description: 'Precious gemstone', type: 'material', base_price: 75 },
      { name: 'Steel Ingot', description: 'High quality steel bar', type: 'material', base_price: 30 },
      { name: 'Fabric Roll', description: 'Fine fabric for clothing', type: 'material', base_price: 12 }
    ];

    [...equipmentItems, ...consumableItems, ...materialItems].forEach(item => {
      items.push({
        id: uuidv4(),
        name: item.name,
        description: item.description,
        type: item.type,
        base_price: item.base_price,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    await queryInterface.bulkInsert('items', items);

    // 2. Seed Shops
    const shops = [
      {
        id: uuidv4(),
        name: 'General Store',
        description: 'Your one-stop shop for all adventuring needs',
        shop_type: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Weapon & Armor Shop',
        description: 'The finest equipment for warriors',
        shop_type: 'equipment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Potion Shop',
        description: 'Magical brews and healing potions',
        shop_type: 'consumable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Material Trader',
        description: 'Raw materials and crafting supplies',
        shop_type: 'material',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('shops', shops);

    // 3. Get inserted data for shop_items
    const [insertedItems] = await queryInterface.sequelize.query(
      'SELECT id, name, type, base_price FROM items ORDER BY name'
    );
    
    const [insertedShops] = await queryInterface.sequelize.query(
      'SELECT id, name, shop_type FROM shops ORDER BY name'
    );

    // 4. Seed Shop Items
    const shopItems = [];

    insertedShops.forEach(shop => {
      if (shop.shop_type === 'general') {
        
        const equipmentForGeneral = insertedItems.filter(item => item.type === 'equipment').slice(0, 5);
        const consumableForGeneral = insertedItems.filter(item => item.type === 'consumable').slice(0, 5);  
        const materialForGeneral = insertedItems.filter(item => item.type === 'material').slice(0, 5);
        
        [...equipmentForGeneral, ...consumableForGeneral, ...materialForGeneral].forEach(item => {
          shopItems.push({
            id: uuidv4(),
            shop_id: shop.id,
            item_id: item.id,
            price: Math.floor(item.base_price * (1.1 + Math.random() * 0.3)),
            stock: Math.floor(Math.random() * 50) + 10,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      } else {
        
        const itemsForShop = insertedItems.filter(item => item.type === shop.shop_type).slice(0, 10);
        
        itemsForShop.forEach(item => {
          shopItems.push({
            id: uuidv4(),
            shop_id: shop.id,
            item_id: item.id,
            price: Math.floor(item.base_price * (0.9 + Math.random() * 0.2)),
            stock: Math.floor(Math.random() * 100) + 20,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
    });

    await queryInterface.bulkInsert('shop_items', shopItems);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shop_items', null, {});
    await queryInterface.bulkDelete('shops', null, {});
    await queryInterface.bulkDelete('items', null, {});
  }
};
