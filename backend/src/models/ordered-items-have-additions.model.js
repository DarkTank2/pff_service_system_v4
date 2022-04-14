const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const orderedItemsHaveAdditions = sequelizeClient.define('ordered_items_have_additions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: true
    }, {
        hooks: {
            beforeCount(options) {
                options.raw = true
            }
        }
    })

    orderedItemsHaveAdditions.associate = ({ ordered_items, additions }) => {
        orderedItemsHaveAdditions.belongsTo(ordered_items, { foreignKey: { allowNull: false }})
        orderedItemsHaveAdditions.belongsTo(additions, { foreignKey: { allowNull: false }})
    }
    return orderedItemsHaveAdditions
}