const Libro = require('../models/Libro');
const Categoria = require('../models/Categoria');
const Autor = require('../models/Autor');
const Editorial = require('../models/Editorial');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.listarLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll({
      include: [
        { model: Categoria, as: 'categoria', attributes: ['nombre'] },
        { model: Autor, as: 'autor', attributes: ['nombre', 'correo'] },
        { model: Editorial, as: 'editorial', attributes: ['nombre'] },
      ],
    });

    const librosData = libros.map(libro => ({
      ...libro.get({ plain: true }),
      categoria: libro.categoria ? libro.categoria.get({ plain: true }) : {},
      autor: libro.autor ? libro.autor.get({ plain: true }) : {},
      editorial: libro.editorial ? libro.editorial.get({ plain: true }) : {}
    }));
    
    res.render('libros/mantenimientoLibros', { libros: librosData });
  } catch (error) {
    console.error("Error al listar los libros:", error);
    res.status(500).send("Error al listar los libros.");
  }
};

exports.formularioCrearLibro = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    const autores = await Autor.findAll();
    const editoriales = await Editorial.findAll();

    res.render('libros/nuevoLibro', {
      categorias: categorias.map(categoria => categoria.get({ plain: true })),
      autores: autores.map(autor => autor.get({ plain: true })),
      editoriales: editoriales.map(editorial => editorial.get({ plain: true }))
    });
  } catch (error) {
    console.error("Error al cargar formulario de creación:", error);
    res.status(500).send("Error al cargar formulario de creación.");
  }
};

exports.crearLibro = async (req, res) => {
  try {
    const { titulo, anoPublicacion, descripcion, categoria, autor, editorial } = req.body;
    const portada = req.file ? `/uploads/${req.file.filename}` : '';

    const libro = await Libro.create({
      titulo,
      anoPublicacion,
      descripcion,
      portada,
      idCategoria: categoria,
      idAutor: autor,
      idEditorial: editorial,
    });

    const autorEncontrado = await Autor.findByPk(autor);

    if (autorEncontrado) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: autorEncontrado.correo,
        subject: `Nuevo libro publicado: ${titulo}`,
        text: `Estimado ${autorEncontrado.nombre},\n\nSe ha publicado un nuevo libro titulado "${titulo}".\n\nSaludos,\nEquipo de  Biblioteca del Itla`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("Error al enviar el correo:", error);
        else console.log("Correo enviado:", info.response);
      });
    }

    res.redirect('/libros');
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).send("Error al crear el libro.");
  }
};

exports.formularioEditarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
        { model: Autor, as: 'autor', attributes: ['id', 'nombre'] },
        { model: Editorial, as: 'editorial', attributes: ['id', 'nombre'] },
      ],
    });
    const categorias = await Categoria.findAll();
    const autores = await Autor.findAll();
    const editoriales = await Editorial.findAll();

    if (!libro) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    res.render('libros/editarLibro', { 
      libro: libro.get({ plain: true }),
      categorias: categorias.map(categoria => categoria.get({ plain: true })),
      autores: autores.map(autor => autor.get({ plain: true })),
      editoriales: editoriales.map(editorial => editorial.get({ plain: true }))
    });
  } catch (error) {
    console.error("Error al cargar formulario de edición:", error);
    res.status(500).send("Error al cargar formulario de edición.");
  }
};

exports.editarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, anoPublicacion, descripcion, categoria, autor, editorial } = req.body;
    const libro = await Libro.findByPk(id);

    if (!libro) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    libro.titulo = titulo;
    libro.anoPublicacion = anoPublicacion;
    libro.descripcion = descripcion;
    libro.idCategoria = categoria;
    libro.idAutor = autor;
    libro.idEditorial = editorial;

    if (req.file) {
      libro.portada = `/uploads/${req.file.filename}`;
    }

    await libro.save();
    res.redirect('/libros');
  } catch (error) {
    console.error("Error al editar el libro:", error);
    res.status(500).send("Error al editar el libro.");
  }
};

exports.verDetalleLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['nombre'] },
        { model: Autor, as: 'autor', attributes: ['nombre', 'correo'] },
        { model: Editorial, as: 'editorial', attributes: ['nombre', 'pais', 'telefono'] },
      ],
    });

    if (!libro) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    const libroData = {
      ...libro.get({ plain: true }),
      categoria: libro.categoria ? libro.categoria.get({ plain: true }) : {},
      autor: libro.autor ? libro.autor.get({ plain: true }) : {},
      editorial: libro.editorial ? libro.editorial.get({ plain: true }) : {}
    };

    res.render('libros/libroDetail', { libro: libroData });
  } catch (error) {
    console.error("Error al cargar los detalles del libro:", error);
    res.status(500).send("Error al cargar los detalles del libro.");
  }
};

exports.confirmarEliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id);

    if (!libro) {
      res.status(404).send("Libro no encontrado");
      return;
    }

    res.render('libros/confirmarEliminarLibro', { libro: libro.get({ plain: true }) });
  } catch (error) {
    console.error("Error al cargar confirmación de eliminación:", error);
    res.status(500).send("Error al cargar confirmación de eliminación.");
  }
};

exports.eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await Libro.destroy({ where: { id } });
    res.redirect('/libros');
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    res.status(500).send("Error al eliminar el libro.");
  }
};
