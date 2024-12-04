const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/', libroController.listarLibros);

router.get('/nuevo', libroController.formularioCrearLibro);

router.post('/crear', upload.single('portada'), libroController.crearLibro);

router.get('/editar/:id', libroController.formularioEditarLibro);

router.post('/editar/:id', upload.single('portada'), libroController.editarLibro);

router.get('/eliminar/:id', libroController.confirmarEliminarLibro);

router.post('/eliminar/:id', libroController.eliminarLibro);

router.get('/detalle/:id', libroController.verDetalleLibro);

module.exports = router;
