const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const baseItemsHaveAdditions = sequelizeClient.define('baseItemsHaveAdditions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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

    baseItemsHaveAdditions.associate = ({ baseItems, additions }) => {
        baseItemsHaveAdditions.belongsTo(baseItems, { foreignKey: { allowNull: false }})
        baseItemsHaveAdditions.belongsTo(additions, { foreignKey: { allowNull: false }})
    }
    return baseItemsHaveAdditions
}