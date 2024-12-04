const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');

router.get('/', autorController.listarAutores);

router.get('/nuevo', autorController.formularioCrearAutor);

router.post('/crear', autorController.crearAutor);

router.get('/editar/:id', autorController.formularioEditarAutor);

router.post('/editar/:id', autorController.editarAutor);

router.get('/eliminar/:id', autorController.confirmarEliminarAutor);

router.post('/eliminar/:id', autorController.eliminarAutor);

module.exports = router;
