const { Libro, Categoria, Autor, Editorial } = require('../models');
const { Op } = require('sequelize');

exports.homePage = async (req, res) => {
  try {
    const { titulo, categorias } = req.query;
    const filtros = {};

    if (titulo) {
      filtros.titulo = { [Op.like]: `%${titulo}%` };
    }
    if (categorias) {
      filtros.idCategoria = { [Op.in]: Array.isArray(categorias) ? categorias : [categorias] };
    }

    const libros = await Libro.findAll({
      where: filtros,
      include: [
        { model: Categoria, as: 'categoria', attributes: ['nombre'] },
        { model: Autor, as: 'autor', attributes: ['nombre'] },
        { model: Editorial, as: 'editorial', attributes: ['nombre', 'pais', 'telefono'] }
      ]
    });

    const librosData = libros.map(libro => libro.get({ plain: true }));
    const todasCategorias = await Categoria.findAll();
    const categoriasData = todasCategorias.map(categoria => categoria.get({ plain: true }));

    res.render('home', {
      libros: librosData,
      categorias: categoriasData,
      filtros: { titulo, categorias }
    });
  } catch (error) {
    console.error("Error al cargar la página principal:", error);
    res.status(500).send("Error al cargar la página principal.");
  }
};
