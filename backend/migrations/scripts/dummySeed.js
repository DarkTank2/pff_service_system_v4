'use strict'

const supportfunctions = require('../supportfunctions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // await supportfunctions.someFunction()
      await queryInterface.removeConstraint('items', 'items_sizeId_flavourId_key')
      await queryInterface.removeConstraint('items', 'items_baseItemId_key')
      await queryInterface.addConstraint('items', {
        fields: ['baseItemId', 'sizeId', 'flavourId'],
        type: 'unique'
      })
      await queryInterface.bulkInsert('types', [
        { id: 1, name: 'Trinken' },
        { id: 2, name: 'Essen' }
      ])
      await queryInterface.bulkInsert('categories', [
        { id: 1, name: 'Speisen' },
        { id: 2, name: 'Anti-Alk' },
        { id: 3, name: 'Weis-Offen' },
        { id: 4, name: 'Rot-Offen' },
        { id: 5, name: 'W-Fl.' },
        { id: 6, name: 'R-Fl.' },
        { id: 7, name: 'Biere' },
        { id: 8, name: 'Sonstiges' }
      ])
      await queryInterface.bulkInsert('baseItems', [
        { id: 1, name: 'apfelsaft', typeId: 1, categoryId: 1 }
      ])
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '0.25l'},
        { id: 2, name: '0.33l'},
        { id: 3, name: '0.5l'},
        { id: 4, name: '0.7l'}
      ])
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'ohne' }
      ])
      await queryInterface.bulkInsert('tables', [
        { name: 'Tisch Nr.1' },
        { name: 'Tisch Nr.2' },
        { name: 'Tisch Nr.3' },
        { name: 'Tisch Nr.4' },
        { name: 'Tisch Nr.5' },
        { name: 'Tisch Nr.6' },
        { name: 'Tisch Nr.7' },
        { name: 'Tisch Nr.8' },
        { name: 'Tisch Nr.9' },
        { name: 'Tisch Nr.10' },
        { name: 'Tisch Nr.11' },
        { name: 'Tisch Nr.12' },
        { name: 'Tisch Nr.13' },
        { name: 'Tisch Nr.14' },
        { name: 'Tisch Nr.15' },
        { name: 'Tisch Nr.16' },
        { name: 'Tisch Nr.17' },
        { name: 'Tisch Nr.18' }
      ])
      
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // await supportfunctions.someFunction()
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
