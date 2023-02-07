'use strict'

const supportfunctions = require('../supportfunctions')
const { getSequenceIdentifier, setSequenceToValue } = require('../supportfunctions')
const fs = require('fs')
const path = require('path')

let colors = ['blue darken-3', 'orange darken-3', 'green darken-3']

let categories = []
let baseItems = []
let sizes = []
let flavours = []
let items = []

let csvFilename = path.parse(__filename).name
console.log(`Importing .csv-file "${csvFilename}.csv"`)
let fileContent = fs.readFileSync(path.join(...[process.cwd(), 'migrations', 'files', `${csvFilename}.csv`]), 'utf-8')
fileContent.split('\r\n').forEach((line, index) => {
  if (index === 0 || line.length === 0) {
    // skip title-line and last empty line
    return
  }
  let cells = line.split(';')
  let { category, size, baseItem, flavour, price } = extractData(cells)
  let categoryIndex = categories.indexOf(category)
  let baseItemIndex = baseItems.findIndex(({ name }) => name === baseItem)
  let sizeIndex = sizes.indexOf(size)
  let flavourIndex = flavours.indexOf(flavour)
  if (categoryIndex === -1) {
    categoryIndex = categories.length
    categories.push(category)
  }
  if (baseItemIndex === -1) {
    baseItemIndex = baseItems.length
    baseItems.push({ categoryId: categoryIndex + 1, name: baseItem })
  }
  if (sizeIndex === -1) {
    sizeIndex = sizes.length
    sizes.push(size)
  }
  if (flavourIndex === -1) {
    flavourIndex = flavours.length
    flavours.push(flavour)
  }
  items.push({ baseItemId: baseItemIndex + 1, sizeId: sizeIndex + 1, flavourId: flavourIndex + 1, price })
})

function extractData (cells = []) {
  let category, size, baseItem, flavour, price
  category = cells[9].length === 0 ? '-' : cells[9]
  size = cells[6].length === 0 ? '-' : cells[6]
  baseItem = cells[0]
  flavour = cells[1].length === 0 ? '-' : cells[1]
  price = cells[7]
  if (price.includes('€')) {
    let euroIndex = price.indexOf('€')
    price = price.splice(euroIndex, 1)
  }
  price = price.replace(',', '.')
  price = parseFloat(price)
  return { category, size, baseItem, flavour, price }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await supportfunctions.syncDB()
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('categories', categories.map((category, index) => {
        return {
          name: category,
          id: index + 1,
          color: colors[index % colors.length]
        }
      }))
      await setSequenceToValue(queryInterface, getSequenceIdentifier('categories', 'id'), '(SELECT MAX(id) FROM public.categories)')
      console.log('Added categories')
      await queryInterface.bulkInsert('base_items', baseItems.map((baseItem, index) => {
        return {
          ...baseItem,
          id: index + 1
        }
      }))
      await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items', 'id'), '(SELECT MAX(id) FROM public.base_items)')
      console.log('Added base_items')
      await queryInterface.bulkInsert('sizes', sizes.map((size, index) => {
        return {
          name: size,
          id: index + 1
        }
      }))
      await setSequenceToValue(queryInterface, getSequenceIdentifier('sizes', 'id'), '(SELECT MAX(id) FROM public.sizes)')
      console.log('Added sizes')
      await queryInterface.bulkInsert('flavours', flavours.map((flavour, index) => {
        return {
          name: flavour,
          id: index + 1
        }
      }))
      await setSequenceToValue(queryInterface, getSequenceIdentifier('flavours', 'id'), '(SELECT MAX(id) FROM public.flavours)')
      console.log('Added flavours')
      await queryInterface.bulkInsert('items', items)
      // await setSequenceToValue(queryInterface, getSequenceIdentifier('items', 'id'), '(SELECT MAX(id) FROM public.flavours)')
      console.log('Added items')
      await queryInterface.bulkInsert('additions', [
        { id: 1, name: 'Senf', priceModifier: 0 },
        { id: 2, name: 'Ketchup', priceModifier: 0 },
        { id: 3, name: 'Kren', priceModifier: 0 },
        { id: 4, name: 'Semmel', priceModifier: 0 },
        { id: 5, name: 'Brot', priceModifier: 0 }
      ])
      await setSequenceToValue(queryInterface, getSequenceIdentifier('additions', 'id'), '(SELECT MAX(id) FROM public.additions)')
      console.log('Added additions')
      // await queryInterface.bulkInsert('base_items_have_additions', [
      //   { id: 1, baseItemId: 3, additionId: 1, default: true },
      //   { id: 2, baseItemId: 3, additionId: 2, default: true },
      //   { id: 3, baseItemId: 3, additionId: 3 },
      //   { id: 4, baseItemId: 3, additionId: 4, default: true },
      //   { id: 5, baseItemId: 3, additionId: 5 }
      // ])
      // await setSequenceToValue(queryInterface, getSequenceIdentifier('base_items_have_additions', 'id'), '(SELECT MAX(id) FROM public.base_items_have_additions)')
      // console.log('Linked base-items to additions')
      
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
      // await supportfunctions.someFunction()
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
