'use strict'

const supportfunctions = require('../supportfunctions')
const { getSequenceIdentifier, setSequenceToValue } = require('../supportfunctions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // await supportfunctions.someFunction()
      await queryInterface.removeConstraint('items', 'items_sizeId_flavourId_key')
      console.log('Removed constraint items_sizeId_flavourId_key')
      await queryInterface.removeConstraint('items', 'items_baseItemId_key')
      console.log('Removed constraint items_baseItemId_key')
      await queryInterface.addConstraint('items', {
        fields: ['baseItemId', 'sizeId', 'flavourId'],
        type: 'unique'
      })
      console.log('Added unique constraint')
      await queryInterface.bulkInsert('types', [
        { id: 1, name: 'Trinken' },
        { id: 2, name: 'Essen' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('types', 'id'), 3)
      console.log('Added types')
      await queryInterface.bulkInsert('categories', [
        { id: 1, name: 'Speisen', typeId: 2 },
        { id: 2, name: 'Anti-Alk', typeId: 1 },
        { id: 3, name: 'Weis-Offen', typeId: 1 },
        { id: 4, name: 'Rot-Offen', typeId: 1 },
        { id: 5, name: 'W-Fl.', typeId: 1 },
        { id: 6, name: 'R-Fl.', typeId: 1 },
        { id: 7, name: 'Biere', typeId: 1 },
        { id: 8, name: 'Sonstiges', typeId: 1 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), 9)
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', [
        { id: 1, name: 'apfelsaft', categoryId: 2 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), 2)
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '0.25l'},
        { id: 2, name: '0.33l'},
        { id: 3, name: '0.5l'},
        { id: 4, name: '0.7l'}
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), 5)
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'ohne' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), 4)
      console.log('Added flavours')
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
      await setSequenceToValue(queryInterface, getSequenceIdentifier('tables', 'id'), '(SELECT MAX(id) FROM public.tables)')
      console.log('Added tables')
      
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
