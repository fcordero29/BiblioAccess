const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Autor = sequelize.define('Autor', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'Autores',
  timestamps: false,
});

module.exports = Autor;
