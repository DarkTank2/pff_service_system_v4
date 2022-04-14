const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const orderedItems = sequelizeClient.define('ordered_items', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        finished: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        served: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        cashed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        waiter: {
          type: DataTypes.STRING,
          allowNull: false
        },
        comment: {
          type: DataTypes.STRING,
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

    orderedItems.associate = ({ items, additions, tables }) => {
        orderedItems.belongsTo(tables, { foreignKey: { allowNull: false } })
        orderedItems.belongsToMany(additions, {
            through: 'ordere_items_have_additions'
        })
        orderedItems.belongsTo(items, { foreignKey: { allowNull: false }})
        // orderedItems.belongsToMany(extensions, {
        //     through: 'orderedItemsHaveExtensions'
        // })
    }
    return orderedItems
}