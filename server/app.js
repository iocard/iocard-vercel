const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/iocard', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.use(express.json());

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

app.listen(3000, () => {
  console.log('Servidor iniciado en puerto 3000');
});
