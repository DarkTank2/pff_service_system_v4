const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const sizes = sequelizeClient.define('sizes', {
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

    sizes.associate = ({ baseItems, flavours, items }) => { // eslint-disable-line no-unused-vars
        sizes.belongsToMany(baseItems, {
            through: items
        })
        sizes.belongsToMany(flavours, {
            through: items
        })
    }
    return sizes
}