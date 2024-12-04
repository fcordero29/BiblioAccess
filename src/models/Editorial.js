const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Editorial = sequelize.define('Editorial', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true, 
    },
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Editoriales',
  timestamps: false,
});

module.exports = Editorial;
