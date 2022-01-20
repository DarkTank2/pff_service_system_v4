const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const baseItems = sequelizeClient.define('baseItems', {
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

    baseItems.associate = ({ additions, sizes, flavours, types, categories, items }) => { // eslint-disable-line no-unused-vars
        baseItems.belongsToMany(sizes, {
            through: items
        })
        baseItems.belongsToMany(flavours, {
            through: items
        })
        baseItems.belongsToMany(additions, {
            through: 'baseItemsHaveAdditions'
        })
        baseItems.belongsTo(types, { foreignKey: { allowNull: false } })
        baseItems.belongsTo(categories, { foreignKey: { allowNull: false } })
    }
    return baseItems
}