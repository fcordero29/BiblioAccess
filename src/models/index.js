const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Libro = require('./Libro');
const Categoria = require('./Categoria');
const Autor = require('./Autor');
const Editorial = require('./Editorial');

Categoria.hasMany(Libro, { as: 'libros', foreignKey: 'idCategoria' });
Libro.belongsTo(Categoria, { as: 'categoria', foreignKey: 'idCategoria' });

Autor.hasMany(Libro, { as: 'libros', foreignKey: 'idAutor' });
Libro.belongsTo(Autor, { as: 'autor', foreignKey: 'idAutor' });

Editorial.hasMany(Libro, { as: 'libros', foreignKey: 'idEditorial' });
Libro.belongsTo(Editorial, { as: 'editorial', foreignKey: 'idEditorial' });

module.exports = {
  sequelize,
  Sequelize,
  Libro,
  Categoria,
  Autor,
  Editorial,
};
