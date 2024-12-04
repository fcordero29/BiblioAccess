require('dotenv').config(); 

const express = require('express');
const { engine } = require('express-handlebars'); 
const path = require('path');
const sequelize = require('./src/config/database'); 
const multer = require('multer');
const session = require('express-session'); 
const SequelizeStore = require("connect-session-sequelize")(session.Store); 

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  helpers: {
    isSelected: function (selectedCategories, id) {
      if (!Array.isArray(selectedCategories)) {
        selectedCategories = [selectedCategories];
      }
      return selectedCategories.includes(id.toString()) ? 'selected' : '';
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // Manejo de datos JSON

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir la carpeta 'uploads'


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const homeRoutes = require('./src/routes/homeRoutes');
const libroRoutes = require('./src/routes/libroRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const autorRoutes = require('./src/routes/autorRoutes');
const editorialRoutes = require('./src/routes/editorialRoutes');

app.use('/', homeRoutes);
app.use('/libros', libroRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/autores', autorRoutes);
app.use('/editoriales', editorialRoutes);

sequelize.sync()
  .then(() => {
    console.log('Conectado a la base de datos.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

module.exports = app;
