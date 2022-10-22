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
        { id: 1, name: 'Getränke', color: 'orange darken-3' },
        { id: 2, name: 'Weine', color: 'blue darken-3' },
        { id: 3, name: 'Speisen', color: 'green darken-3' },
        { id: 4, name: 'Sonstiges', color: 'green darken-3' }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), 5)
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', [
        { id:  1, name: 'Käsekornspitz', categoryId: 3 },
        { id:  2, name: 'Schinkenstangerl', categoryId: 3 },
        { id:  3, name: 'Leberkäs-S.', categoryId: 3 },
        { id:  4, name: 'Brezn', categoryId: 3 },

        { id:  5, name: 'Cola', categoryId: 1 },
        { id:  6, name: 'Almdudler', categoryId: 1 },
        { id:  7, name: 'Orangensaft', categoryId: 1 },
        { id:  8, name: 'Apfelsaft', categoryId: 1 },
        { id:  9, name: 'Mineralwasser', categoryId: 1 },
        { id: 10, name: 'Sturm', categoryId: 1 },
        { id: 11, name: 'GSpritzter', categoryId: 1 },

        { id: 12, name: 'Weinviertler DAC (GV)', categoryId: 2 },
        { id: 13, name: 'Gelber Muskateller', categoryId: 2 },
        { id: 14, name: 'Wr. Gemischter Satz', categoryId: 2 },
        { id: 15, name: 'Zweigelt', categoryId: 2 },
        { id: 16, name: 'Rhett Butler', categoryId: 2 },

        { id: 17, name: 'Wasser', categoryId: 4 },
        { id: 18, name: 'Gläser', categoryId: 4 },

        { id: 19, name: 'Würstel', categoryId: 3 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), 20)
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', [
        { id: 1, name: '1/8l'},
        { id: 2, name: '1/4l'},
        { id: 3, name: '0.33l'},
        { id: 4, name: '0.5l'},
        { id: 5, name: '0.7l (Flasche)'},
        { id: 6, name: '1l' },
        { id: 7, name: 'normal'},
        { id: 8, name: 'Portion' },
        { id: 9, name: '1 Stück'},
        { id: 10, name: 'Glas' },
        { id: 11, name: 'Flasche' },
        { id: 12, name: 'Krug' },
        { id: 13, name: '-'}
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), 14)
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', [
        { id: 1, name: 'gespritzt leitung' },
        { id: 2, name: 'gespritzt mineral' },
        { id: 3, name: 'pur' },
        { id: 4, name: 'Käsleberkäs'},
        { id: 5, name: 'Normal'},
        { id: 6, name: 'Pikant'},
        { id: 7, name: 'weiss' },
        { id: 8, name: 'rot' },
        { id: 9, name: 'normal' },
        { id: 10, name: '-'},
        { id: 11, name: 'Sektglas'},
        { id: 12, name: 'Weinglas'},
        { id: 13, name: 'Kleines Glas (1/4l)'},
        { id: 14, name: 'Grosses Glas (1/2l)'}
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), 15)
      console.log('Added flavours')
      await queryInterface.bulkInsert('items', [
        { price: 3, baseItemId: 1, sizeId: 8, flavourId: 10, default: true },
        { price: 3, baseItemId: 2, sizeId: 8, flavourId: 10, default: true },
        { price: 3.5, baseItemId: 3, sizeId: 8, flavourId: 4 },
        { price: 3.5, baseItemId: 3, sizeId: 8, flavourId: 5, default: true },
        { price: 3.5, baseItemId: 3, sizeId: 8, flavourId: 6 },
        { price: 3, baseItemId: 4, sizeId: 8, flavourId: 10, default: true },

        { price: 2.5, baseItemId: 5, sizeId: 3, flavourId: 10, default: true },
        { price: 2.5, baseItemId: 6, sizeId: 3, flavourId: 10, default: true },

        { price: 2, baseItemId: 7, sizeId: 2, flavourId: 3, default: true },
        { price: 4, baseItemId: 7, sizeId: 4, flavourId: 3 },
        { price: 2, baseItemId: 7, sizeId: 2, flavourId: 1 },
        { price: 4, baseItemId: 7, sizeId: 4, flavourId: 1 },
        { price: 2, baseItemId: 7, sizeId: 2, flavourId: 2 },
        { price: 4, baseItemId: 7, sizeId: 4, flavourId: 2 },
        { price: 2, baseItemId: 8, sizeId: 2, flavourId: 3, default: true },
        { price: 4, baseItemId: 8, sizeId: 4, flavourId: 3 },
        { price: 2, baseItemId: 8, sizeId: 2, flavourId: 1 },
        { price: 4, baseItemId: 8, sizeId: 4, flavourId: 1 },
        { price: 2, baseItemId: 8, sizeId: 2, flavourId: 2 },
        { price: 4, baseItemId: 8, sizeId: 4, flavourId: 2 },

        { price: 1.2, baseItemId: 9, sizeId: 2, flavourId: 10, default: true },
        { price: 4, baseItemId: 9, sizeId: 6, flavourId: 10 },
        { price: 2.5, baseItemId: 10, sizeId: 2, flavourId: 7, default: true },
        { price: 2.5, baseItemId: 10, sizeId: 2, flavourId: 8 },

        { price: 2.5, baseItemId: 11, sizeId: 2, flavourId: 10, default: true },
        { price: 3, baseItemId: 12, sizeId: 1, flavourId: 10, default: true },
        { price: 15, baseItemId: 12, sizeId: 5, flavourId: 10 },
        { price: 3.6, baseItemId: 13, sizeId: 1, flavourId: 10, default: true },
        { price: 18, baseItemId: 13, sizeId: 5, flavourId: 10 },
        { price: 3.6, baseItemId: 14, sizeId: 1, flavourId: 10, default: true },
        { price: 18, baseItemId: 14, sizeId: 5, flavourId: 10 },
        { price: 3, baseItemId: 15, sizeId: 1, flavourId: 10, default: true },
        { price: 15, baseItemId: 15, sizeId: 5, flavourId: 10 },
        { price: 3.9, baseItemId: 16, sizeId: 1, flavourId: 10, default: true },
        { price: 20, baseItemId: 16, sizeId: 5, flavourId: 10 },

        { price: 0, baseItemId: 17, sizeId: 12, flavourId: 10, default: true },
        { price: 0, baseItemId: 17, sizeId: 2, flavourId: 10 },
        { price: 0, baseItemId: 17, sizeId: 4, flavourId: 10 },
        { price: 0, baseItemId: 18, sizeId: 13, flavourId: 11, default: true },
        { price: 0, baseItemId: 18, sizeId: 13, flavourId: 12 },
        { price: 0, baseItemId: 18, sizeId: 13, flavourId: 13 },
        { price: 0, baseItemId: 18, sizeId: 13, flavourId: 14 },

        { price: 3.5, baseItemId: 19, sizeId: 8, flavourId: 10, default: true }
      ])
      // await setSequenceToValue(queryInterface, getSequenceIdentifier('items', 'id'), 64)
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
        { id: 1, baseItemId: 19, additionId: 1, default: true },
        { id: 2, baseItemId: 19, additionId: 2, default: true },
        { id: 3, baseItemId: 19, additionId: 3 },
        { id: 4, baseItemId: 19, additionId: 4, default: true },
        { id: 5, baseItemId: 19, additionId: 5 }
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
