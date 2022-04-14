const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const flavours = sequelizeClient.define('flavours', {
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

    flavours.associate = ({ base_items, sizes, items }) => { // eslint-disable-line no-unused-vars
        flavours.belongsToMany(base_items, {
            through: items
        })
        flavours.belongsToMany(sizes, {
            through: items
        })
    }
    return flavours
}