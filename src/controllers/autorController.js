const Autor = require('../models/Autor');
const Libro = require('../models/Libro');

exports.listarAutores = async (req, res) => {
  try {
    const autores = await Autor.findAll({
      include: [
        {
          model: Libro,
          as: 'libros',
          attributes: ['id'],
        },
      ],
    });

    const autoresConCantidad = autores.map((autor) => {
      return {
        ...autor.get(),
        cantidadLibros: autor.libros ? autor.libros.length : 0,
      };
    });

    res.render('autores/mantenimientoAutores', { autores: autoresConCantidad });
  } catch (error) {
    console.error("Error al listar los autores:", error);
    res.status(500).send("Error al listar los autores.");
  }
};

exports.formularioCrearAutor = (req, res) => {
  res.render('autores/nuevoAutor');
};

exports.crearAutor = async (req, res) => {
  try {
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
      res.render('autores/nuevoAutor', { error: "Todos los campos son obligatorios." });
      return;
    }

    const autorExistente = await Autor.findOne({ where: { correo } });
    if (autorExistente) {
      res.render('autores/nuevoAutor', { error: "El correo ya está registrado.", nombre });
      return;
    }

    await Autor.create({ nombre, correo });
    res.redirect('/autores');
  } catch (error) {
    console.error("Error al crear el autor:", error);
    res.status(500).send("Error al crear el autor.");
  }
};

exports.formularioEditarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      res.status(404).send("Autor no encontrado");
      return;
    }

    res.render('autores/editarAutor', { autor: autor.get() }); 
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición.");
  }
};

exports.editarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      res.status(404).send("Autor no encontrado");
      return;
    }

    if (!nombre || !correo) {
      res.render('autores/editarAutor', { autor: autor.get(), error: "Todos los campos son obligatorios." }); // JSON plano
      return;
    }

    autor.nombre = nombre;
    autor.correo = correo;
    await autor.save();

    res.redirect('/autores');
  } catch (error) {
    console.error("Error al editar el autor:", error);
    res.status(500).send("Error al editar el autor.");
  }
};

exports.confirmarEliminarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      res.status(404).send("Autor no encontrado");
      return;
    }

    res.render('autores/confirmarEliminarAutor', { autor: autor.get() });
  } catch (error) {
    console.error("Error al cargar confirmación de eliminación:", error);
    res.status(500).send("Error al cargar confirmación de eliminación.");
  }
};

exports.eliminarAutor = async (req, res) => {
  try {
    const { id } = req.params;
    await Autor.destroy({ where: { id } });
    res.redirect('/autores');
  } catch (error) {
    console.error("Error al eliminar el autor:", error);
    res.status(500).send("Error al eliminar el autor.");
  }
};
