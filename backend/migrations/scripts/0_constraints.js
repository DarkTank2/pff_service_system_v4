'use strict'

const supportfunctions = require('../supportfunctions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('items', 'items_sizeId_flavourId_key')
      console.log('Removed constraint items_sizeId_flavourId_key')
      await queryInterface.removeConstraint('items', 'items_baseItemId_key')
      console.log('Removed constraint items_baseItemId_key')
      await queryInterface.addConstraint('items', {
        fields: ['baseItemId', 'sizeId', 'flavourId'],
        type: 'unique'
      })
      console.log('Added unique constraint')
      await transaction.commit()
    } catch (err) {
      console.log(err)
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
