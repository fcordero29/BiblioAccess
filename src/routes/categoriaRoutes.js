const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.listarCategorias);

router.get('/nueva', categoriaController.formularioCrearCategoria);

router.post('/crear', categoriaController.crearCategoria);

router.get('/editar/:id', categoriaController.formularioEditarCategoria);

router.post('/editar/:id', categoriaController.editarCategoria);

router.get('/eliminar/:id', categoriaController.confirmarEliminarCategoria);

router.post('/eliminar/:id', categoriaController.eliminarCategoria);

module.exports = router;
