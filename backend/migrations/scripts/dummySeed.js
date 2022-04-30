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
      await queryInterface.bulkInsert('categories', [
        { id: 1, name: 'Anti-Alk', color: 'blue darken-3' },
        { id: 2, name: 'Wein-Offen', color: 'blue darken-3' },
        { id: 3, name: 'Weiss-Flasche', color: 'blue darken-3' },
        { id: 4, name: 'Rot-Flasche', color: 'blue darken-3' },
        { id: 5, name: 'Biere', color: 'blue darken-3' },
        { id: 6, name: 'Sonstiges', color: 'blue darken-3' },
        { id: 7, name: 'Speisen', color: 'blue darken-3' },
        { id: 8, name: 'Extras', color: 'orange darken-3' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), 10)
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', [
        { id: 1, name: 'Käseweckerl', categoryId: 7 },
        { id: 2, name: 'Crevettencocktail', categoryId: 7 },
        { id: 3, name: 'Würstel', categoryId: 7 },
        { id: 4, name: 'Baguette', categoryId: 7 },
        { id: 5, name: 'Fl.-los Bällchen', categoryId: 7 },
        { id: 6, name: 'Schinkenstangerl', categoryId: 7 },
        { id: 7, name: 'Cola', categoryId: 1 },
        { id: 8, name: 'Almdudler', categoryId: 1 },
        { id: 9, name: 'Orangensaft', categoryId: 1 },
        { id: 10, name: 'Apfelsaft', categoryId: 1 },
        { id: 11, name: 'Mineralwasser', categoryId: 1 },
        { id: 12, name: 'Zwettler', categoryId: 5 },
        { id: 13, name: 'Gösser Radler', categoryId: 5 },
        { id: 14, name: 'Wr. Gemischter Satz, DAC', categoryId: 3 },
        { id: 15, name: 'Weinviertler DAC (GV)', categoryId: 3 },
        { id: 16, name: 'Welschriesling', categoryId: 3 },
        { id: 17, name: 'Gelber Muskateller', categoryId: 3 },
        { id: 18, name: 'Rose Froschkönig', categoryId: 3 },
        { id: 19, name: 'Zweigelt', categoryId: 4 },
        { id: 20, name: 'St. Laurent', categoryId: 4 },
        { id: 21, name: 'Big John', categoryId: 4 },
        { id: 22, name: 'Landwein weiss (GV)', categoryId: 2 },
        { id: 23, name: 'Landwein rot', categoryId: 2 },
        { id: 24, name: 'GSpritzter', categoryId: 2 },
        { id: 25, name: 'Alm-Weiss', categoryId: 2 },
        { id: 26, name: 'Cola-Rot', categoryId: 2 },
        { id: 27, name: 'Spritzwein', categoryId: 2 },
        { id: 28, name: 'Sekt', categoryId: 6 },
        { id: 29, name: 'Aperol Sprizz', categoryId: 6 },
        { id: 30, name: 'Hugo', categoryId: 6 },
        { id: 31, name: 'Wasser', categoryId: 6 },
        { id: 32, name: 'Gläser', categoryId: 6 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), 33)
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '1/8l'},
        { id: 2, name: '0.25l'},
        { id: 3, name: '0.33l'},
        { id: 4, name: '0.5l'},
        { id: 5, name: '0.7l'},
        { id: 6, name: '1l' },
        { id: 7, name: 'normal'},
        { id: 8, name: 'Portion' },
        { id: 9, name: '1 Stück'}
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), 10)
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'pur' },
        { id: 4, name: 'Käsekrainer' },
        { id: 5, name: 'Sacherwürstel' },
        { id: 6, name: 'Grillwürstel' },
        { id: 7, name: 'Aufstrich #1' },
        { id: 8, name: 'Aufstrich #2' },
        { id: 9, name: 'weiss' },
        { id: 10, name: 'rot' },
        { id: 11, name: 'normal' },
        { id: 12, name: '+ Orangensaft' },
        { id: 13, name: 'Prosecco' },
        { id: 14, name: 'Wein' },
        { id: 15, name: '-'}
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), 16)
      console.log('Added flavours')
      await queryInterface.bulkInsert('items', [
        { id: 1, price: 2.8, baseItemId: 1, sizeId: 9, flavourId: 15, default: true },
        { id: 8, price: 3.8, baseItemId: 2, sizeId: 8, flavourId: 15, default: true },
        { id: 8, price: 3.8, baseItemId: 3, sizeId: 8, flavourId: 4, default: true },
        { id: 8, price: 3.8, baseItemId: 3, sizeId: 8, flavourId: 5 },
        { id: 8, price: 3.8, baseItemId: 3, sizeId: 8, flavourId: 6 },
        { id: 8, price: 2.8, baseItemId: 4, sizeId: 8, flavourId: 7, default: true },
        { id: 8, price: 2.8, baseItemId: 4, sizeId: 8, flavourId: 8 },
        { id: 8, price: 3.8, baseItemId: 5, sizeId: 8, flavourId: 15, default: true },
        { id: 8, price: 2.8, baseItemId: 6, sizeId: 9, flavourId: 15, default: true }
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
