const { sequelize } = require('./models');

sequelize.sync({ alter: true })  
  .then(() => {
    console.log('Tablas sincronizadas exitosamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar tablas:', error);
  });
