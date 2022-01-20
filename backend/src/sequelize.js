const Sequelize = require('sequelize');
var env = require('./utilities/env.js');

module.exports = function (app) {
  const connectionString = env.getEnv().DBCREDENTIALS
  if (!connectionString) {
    throw new Error('ENV has no property "DBCREDENTIALS", cannot establish connection to database!')
  }

  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());

    return result;
  };
};
