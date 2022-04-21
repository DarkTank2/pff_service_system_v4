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
        { id: 1, name: 'Speisen', typeId: 2, color: 'blue darken-3' },
        { id: 2, name: 'Anti-Alk', typeId: 1, color: 'blue darken-3' },
        { id: 3, name: 'Weiss-Offen', typeId: 1, color: 'blue darken-3' },
        { id: 4, name: 'Rot-Offen', typeId: 1, color: 'blue darken-3' },
        { id: 5, name: 'W-Fl.', typeId: 1, color: 'blue darken-3' },
        { id: 6, name: 'R-Fl.', typeId: 1, color: 'blue darken-3' },
        { id: 7, name: 'Biere', typeId: 1, color: 'blue darken-3' },
        { id: 8, name: 'Sonstiges', typeId: 1, color: 'blue darken-3' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), 9)
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', [
        { id: 1, name: 'Apfelsaft', categoryId: 2 },
        { id: 2, name: 'Spritzer', categoryId: 3 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), 3)
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '0.25l'},
        { id: 2, name: '0.33l'},
        { id: 3, name: '0.5l'},
        { id: 4, name: '0.7l'},
        { id: 5, name: '1l' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), 6)
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'ohne' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), 4)
      console.log('Added flavours')
      await queryInterface.bulkInsert('items', [
        { id: 1, price: 1.6, baseItemId: 1, sizeId: 1, flavourId: 3, default: true },
        { id: 2, price: 3, baseItemId: 1, sizeId: 3, flavourId: 3 },
        { id: 3, price: 1, baseItemId: 1, sizeId: 1, flavourId: 1 },
        { id: 4, price: 2, baseItemId: 1, sizeId: 3, flavourId: 1 },
        { id: 5, price: 1, baseItemId: 1, sizeId: 1, flavourId: 2 },
        { id: 6, price: 2, baseItemId: 1, sizeId: 3, flavourId: 2 },
        { id: 7, price: 2, baseItemId: 1, sizeId: 5, flavourId: 3 },
        { id: 8, price: 1.8, baseItemId: 2, sizeId: 1, flavourId: 3, default: true }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('items', 'id'), 9)
      console.log('Added items')
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
