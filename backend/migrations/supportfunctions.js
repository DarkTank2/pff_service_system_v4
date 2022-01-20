const _ = require('lodash');

// This function checks first if the attribute already exists in the table
// and only adds the column if it is not existent in the table.
async function addColumn(queryInterface, transaction, table, attribute, attributeoptions, datatype) {
  // console.log('addColumn()')
  const tablestructure = await queryInterface.describeTable(table);
  if (tablestructure[attribute] === undefined) {
    await queryInterface.addColumn(table, attribute, datatype, attributeoptions, { transaction });
    console.log('addColumn() attribute "' + attribute + '" added to table "' + table + '"');
  } else {
    console.log('addColumn() attribute "' + attribute + '" already exists');
  }
}

// Standardized function to create names for foreign keys.
// The returned string is compatible with the string created by feathers
function createForeignKeyName(table, ftable) {
  // console.log('createForeignKeyName()');
  return _.camelCase(table) + '_' + _.camelCase(ftable) + '_fkey';
}

// This function creates the attribute in the referencing table if it does not exist
// and creates the foreign key constraint.
async function createForeignKey(queryInterface, transaction, table, attribute, attributeoptions, datatype, ftable, fattribute) {
  // console.log('createForeignKey()');
  await addColumn(queryInterface, transaction, table, attribute, attributeoptions, datatype);
  const fkeys = await queryInterface.getForeignKeysForTables([table]);
  const fkeyname = createForeignKeyName(table, ftable);
  if (!(fkeys[table] && fkeys[table].includes(fkeyname))) {
    await queryInterface.addConstraint(table, {
      fields: [attribute],
      type: 'foreign key',
      name: fkeyname,
      references: {
        table: ftable,
        field: fattribute
      },
      transaction
    });
    console.log('createForeignKey() foreign key "' + fkeyname + '" created');
  } else {
    console.log('createForeignKey() foreign key "' + fkeyname + '" already exists');
  }
}

// First action of this function is to remove the foreign key constraint from the attribute.
// Second action is to remove the attribute from the referencing table
async function removeForeignKey(queryInterface, transaction, table, attribute, ftable) {
  const fkeyname = createForeignKeyName(table, ftable);
  await queryInterface.removeConstraint(table, fkeyname, { transaction });
  await queryInterface.removeColumn(table, attribute, { transaction });
}

// Instantiate theapp and call the .sync() method of sequelize so that missing tables get created.
async function syncDB() {
  console.log('syncDB()');
  const app = require('../src/app');
  app.setup();
  return app.get('sequelizeSync');
}

module.exports = {
  addColumn,
  createForeignKey,
  removeForeignKey,
  syncDB
};
