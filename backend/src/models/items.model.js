const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const items = sequelizeClient.define('items', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
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

    items.associate = ({ baseItems, sizes, flavours }) => {
        items.belongsTo(baseItems, { foreignKey: { allowNull: false }})
        items.belongsTo(sizes, { foreignKey: { allowNull: false }})
        items.belongsTo(flavours, { foreignKey: { allowNull: false }})
    }
    return items
}