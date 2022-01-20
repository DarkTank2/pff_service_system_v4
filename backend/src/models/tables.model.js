const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const tables = sequelizeClient.define('tables', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false
    }, {
        hooks: {
            beforeCount(options) {
                options.raw = true
            }
        }
    })

    tables.associate = ({ orderedItems }) => { // eslint-disable-line no-unused-vars
        tables.hasMany(orderedItems, { foreignKey: { allowNull: false } })
    }
    return tables
}