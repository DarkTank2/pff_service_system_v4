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
        { id: 8, name: 'Sonstiges', typeId: 1, color: 'blue darken-3' },
        { id: 9, name: 'Extras', typeId: 2, color: 'orange darken-3' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), 10)
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', [
        { id: 1, name: 'Apfelsaft', categoryId: 2 },
        { id: 2, name: 'Spritzer', categoryId: 3 },
        { id: 3, name: 'Faschierter Braten', categoryId: 1 },
        { id: 4, name: 'Kartoffelsalat', categoryId: 9 },
        { id: 5, name: 'Krautsalat', categoryId: 9 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), 6)
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '0.25l'},
        { id: 2, name: '0.33l'},
        { id: 3, name: '0.5l'},
        { id: 4, name: '0.7l'},
        { id: 5, name: '1l' },
        { id: 6, name: 'normal'},
        { id: 7, name: 'Portion' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), 8)
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'ohne' },
        { id: 4, name: 'Kartoffelsalat' },
        { id: 5, name: 'Krautsalat' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), 6)
      console.log('Added flavours')
      await queryInterface.bulkInsert('items', [
        { id: 1, price: 1.6, baseItemId: 1, sizeId: 1, flavourId: 3, default: true },
        { id: 2, price: 3, baseItemId: 1, sizeId: 3, flavourId: 3 },
        { id: 3, price: 1, baseItemId: 1, sizeId: 1, flavourId: 1 },
        { id: 4, price: 2, baseItemId: 1, sizeId: 3, flavourId: 1 },
        { id: 5, price: 1, baseItemId: 1, sizeId: 1, flavourId: 2 },
        { id: 6, price: 2, baseItemId: 1, sizeId: 3, flavourId: 2 },
        { id: 7, price: 2, baseItemId: 1, sizeId: 5, flavourId: 3 },
        { id: 8, price: 1.8, baseItemId: 2, sizeId: 1, flavourId: 3, default: true },
        { id: 9, price: 5.6, baseItemId: 3, sizeId: 6, flavourId: 4, default: true },
        { id: 10, price: 5, baseItemId: 3, sizeId: 6, flavourId: 3 },
        { id: 11, price: 5.6, baseItemId: 3, sizeId: 6, flavourId: 5 },
        { id: 12, price: 1.2, baseItemId: 4, sizeId: 7, flavourId: 3, default: true },
        { id: 13, price: 1.2, baseItemId: 5, sizeId: 7, flavourId: 3, default: true }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('items', 'id'), 14)
      console.log('Added items')
      await queryInterface.bulkInsert('additions', [
        { id: 1, name: 'Senf', priceModifier: 0 },
        { id: 2, name: 'Ketchup', priceModifier: 0 },
        { id: 3, name: 'Kren', priceModifier: 0 },
        { id: 4, name: 'Semmel', priceModifier: 0 },
        { id: 5, name: 'Brot', priceModifier: 0 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('additions', 'id'), 6)
      console.log('Added additions')
      await queryInterface.bulkInsert('base_items_have_additions', [
        { id: 1, baseItemId: 3, additionId: 1, default: true },
        { id: 2, baseItemId: 3, additionId: 2, default: true },
        { id: 3, baseItemId: 3, additionId: 3 },
        { id: 4, baseItemId: 3, additionId: 4, default: true },
        { id: 5, baseItemId: 3, additionId: 5 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items_have_additions', 'id'), 8)
      console.log('Linked base-items to additions')
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
