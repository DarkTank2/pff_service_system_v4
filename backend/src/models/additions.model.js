const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const additions = sequelizeClient.define('additions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        priceModifier: {
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

    additions.associate = ({ base_items, ordered_items }) => { // eslint-disable-line no-unused-vars
        additions.belongsToMany(base_items, {
            through: 'base_items_have_additions'
        })
        additions.belongsToMany(ordered_items, {
            through: 'ordered_items_have_additions'
        })
    }
    return additions
}