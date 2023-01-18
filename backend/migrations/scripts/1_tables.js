'use strict'

const supportfunctions = require('../supportfunctions')
const { getSequenceIdentifier, setSequenceToValue } = require('../supportfunctions')


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
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
