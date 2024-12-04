const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'Categorias',
  timestamps: false,
});

module.exports = Categoria;
