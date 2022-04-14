const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const baseItemsHaveAdditions = sequelizeClient.define('base_items_have_additions', {
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

    baseItemsHaveAdditions.associate = ({ base_items, additions }) => {
        baseItemsHaveAdditions.belongsTo(base_items, { foreignKey: { allowNull: false }})
        baseItemsHaveAdditions.belongsTo(additions, { foreignKey: { allowNull: false }})
    }
    return baseItemsHaveAdditions
}