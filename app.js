const express = require('express');// Déclaration framework express
const path = require('path');//nécessaire pour multer (importation des fichiers)
const bodyParser = require('body-parser');// Déclaration Body-Parser pour récupérer des objets exploitables
const mongoose = require('mongoose');// Déclaration Mongoose pour base de Données MongoDB
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');// Plugin de protection pour diverses attaques
const sauceRouter = require('./routes/sauce');// Déclaration du dossier des routes Sauces
const userRouter = require('./routes/user');// Déclaration du dossier des routes utilisateur

const dotenv = require('dotenv').config(); // Protection de l'acces à ma base de donnée
const session = require('express-session');

const sauce = require('./models/sauce');
const app = express()
console.log(process.env.LOGIN);
mongoose.connect("mongodb+srv://" + process.env.LOGIN+':'+process.env.PASSWORD + "@"+process.env.URL,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(bodyParser.json());
app.use(helmet());



app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', sauceRouter)
app.use('/api/auth', userRouter)

module.exports = app;
