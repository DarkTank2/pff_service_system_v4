const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = app => {
    const sequelizeClient = app.get('sequelizeClient')
    const categories = sequelizeClient.define('categories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
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

    categories.associate = ({ base_items, types }) => {
        categories.belongsTo(types, { foreignKey: { allowNull: false } })
        categories.hasMany(base_items, { foreignKey: { allowNull: false }})
    }
    return categories
}