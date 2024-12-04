const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Libro = sequelize.define('Libro', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anoPublicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  portada: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true, // Permitimos que sea nulo si la descripción es opcional
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false, // Aseguramos que no sea nulo si la relación es obligatoria
    references: {
      model: 'Categorias',
      key: 'id',
    },
  },
  idAutor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Autores',
      key: 'id',
    },
  },
  idEditorial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Editoriales',
      key: 'id',
    },
  },
}, {
  tableName: 'Libros',
  timestamps: false,
});

module.exports = Libro;
