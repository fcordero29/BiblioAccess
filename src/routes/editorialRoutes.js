const express = require('express');
const router = express.Router();
const editorialController = require('../controllers/editorialController');

router.get('/', editorialController.listarEditoriales);

router.get('/nueva', editorialController.formularioCrearEditorial);

router.post('/crear', editorialController.crearEditorial);

router.get('/editar/:id', editorialController.formularioEditarEditorial);

router.post('/editar/:id', editorialController.editarEditorial);

router.get('/eliminar/:id', editorialController.confirmarEliminarEditorial);

router.post('/eliminar/:id', editorialController.eliminarEditorial);

module.exports = router;
