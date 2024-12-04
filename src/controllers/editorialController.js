const Editorial = require('../models/Editorial');
const Libro = require('../models/Libro');

exports.listarEditoriales = async (req, res) => {
  try {
    const editoriales = await Editorial.findAll({
      include: [
        {
          model: Libro,
          as: 'libros',
          attributes: ['id'],
        },
      ],
    });

    const editorialesConCantidad = editoriales.map((editorial) => ({
      ...editorial.get(),
      cantidadLibros: editorial.libros ? editorial.libros.length : 0,
    }));

    res.render('editoriales/mantenimientoEditoriales', { editoriales: editorialesConCantidad });
  } catch (error) {
    console.error("Error al listar las editoriales:", error);
    res.status(500).send("Error al listar las editoriales.");
  }
};

exports.formularioCrearEditorial = (req, res) => {
  try {
    res.render('editoriales/nuevaEditorial');
  } catch (error) {
    console.error("Error al mostrar el formulario de creación de editorial:", error);
    res.status(500).send("Error al mostrar el formulario de creación.");
  }
};

exports.crearEditorial = async (req, res) => {
  try {
    const { nombre, telefono, pais } = req.body;

    if (!nombre || !telefono || !pais) {
      res.render('editoriales/nuevaEditorial', { error: "Todos los campos son obligatorios." });
      return;
    }

    await Editorial.create({ nombre, telefono, pais });
    res.redirect('/editoriales');
  } catch (error) {
    console.error("Error al crear la editorial:", error);
    res.status(500).send("Error al crear la editorial.");
  }
};

exports.formularioEditarEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const editorial = await Editorial.findByPk(id);

    if (!editorial) {
      res.status(404).send("Editorial no encontrada");
      return;
    }

    res.render('editoriales/editarEditorial', { editorial: editorial.get() });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición.");
  }
};

exports.editarEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, pais } = req.body;
    const editorial = await Editorial.findByPk(id);

    if (!editorial) {
      res.status(404).send("Editorial no encontrada");
      return;
    }

    if (!nombre || !telefono || !pais) {
      res.render('editoriales/editarEditorial', { editorial: editorial.get(), error: "Todos los campos son obligatorios." });
      return;
    }

    editorial.nombre = nombre;
    editorial.telefono = telefono;
    editorial.pais = pais;
    await editorial.save();

    res.redirect('/editoriales');
  } catch (error) {
    console.error("Error al editar la editorial:", error);
    res.status(500).send("Error al editar la editorial.");
  }
};

exports.confirmarEliminarEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const editorial = await Editorial.findByPk(id);

    if (!editorial) {
      res.status(404).send("Editorial no encontrada");
      return;
    }

    res.render('editoriales/confirmarEliminarEditorial', { editorial: editorial.get() });
  } catch (error) {
    console.error("Error al cargar confirmación de eliminación:", error);
    res.status(500).send("Error al cargar confirmación de eliminación.");
  }
};

exports.eliminarEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    await Editorial.destroy({ where: { id } });
    res.redirect('/editoriales');
  } catch (error) {
    console.error("Error al eliminar la editorial:", error);
    res.status(500).send("Error al eliminar la editorial.");
  }
};
