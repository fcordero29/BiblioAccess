const Categoria = require('../models/Categoria');
const Libro = require('../models/Libro');

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [
        {
          model: Libro,
          as: 'libros',
          attributes: ['id'],
        },
      ],
    });

    const categoriasConCantidad = categorias.map((categoria) => ({
      ...categoria.get(),
      cantidadLibros: categoria.libros ? categoria.libros.length : 0,
    }));

    console.log("Categorías obtenidas con cantidad de libros:", categoriasConCantidad);

    res.render('categorias/mantenimientoCategorias', { categorias: categoriasConCantidad });
  } catch (error) {
    console.error("Error al listar las categorías:", error);
    res.status(500).send("Error al listar las categorías.");
  }
};

exports.formularioCrearCategoria = (req, res) => {
  try {
    res.render('categorias/nuevaCategoria');
  } catch (error) {
    console.error("Error al mostrar el formulario de creación de categoría:", error);
    res.status(500).send("Error al mostrar el formulario de creación.");
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      res.render('categorias/nuevaCategoria', { error: "El nombre de la categoría es obligatorio." });
      return;
    }

    await Categoria.create({ nombre, descripcion });
    console.log("Categoría creada con éxito:", { nombre, descripcion });
    res.redirect('/categorias');
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.render('categorias/nuevaCategoria', { error: "Error al crear la categoría. Intente de nuevo." });
  }
};

exports.formularioEditarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      res.status(404).send("Categoría no encontrada");
      return;
    }

    res.render('categorias/editarCategoria', { categoria: categoria.get() });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición.");
  }
};

exports.editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      res.status(404).send("Categoría no encontrada");
      return;
    }

    if (!nombre) {
      res.render('categorias/editarCategoria', { categoria: categoria.get(), error: "El nombre de la categoría es obligatorio." });
      return;
    }

    categoria.nombre = nombre;
    categoria.descripcion = descripcion;
    await categoria.save();

    console.log("Categoría actualizada con éxito:", categoria.get());
    res.redirect('/categorias');
  } catch (error) {
    console.error("Error al editar la categoría:", error);
    res.render('categorias/editarCategoria', { categoria: categoria.get(), error: "Error al editar la categoría. Intente de nuevo." });
  }
};

exports.confirmarEliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      res.status(404).send("Categoría no encontrada");
      return;
    }

    res.render('categorias/confirmarEliminarCategoria', { categoria: categoria.get() });
  } catch (error) {
    console.error("Error al cargar confirmación de eliminación:", error);
    res.status(500).send("Error al cargar confirmación de eliminación.");
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.destroy({ where: { id } });
    console.log(`Categoría con ID ${id} eliminada`);
    res.redirect('/categorias');
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).send("Error al eliminar la categoría.");
  }
};
