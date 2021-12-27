const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const mailValidator = require('email-validator');
const mongoose = require('mongoose');
const User = require('../models/user');
const { RateLimiterMongo } = require('rate-limiter-flexible'); // Limitation du nombre de tentatives de connexion
require('dotenv').config();

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email, 
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {console.log(error);
        res.status(500).json({ error })});
        
};

// Connexion de d'un utilisateur déjà enregistré ---

// Configurations pour la BDD
const mongoConn = mongoose.connection;
const opts = {
    storeClient: mongoConn,
    dbName: "rate-limit",
    tableName: "rate-limit",
    points: 3,
    duration: 60,
}

const rateLimiterMongo = new RateLimiterMongo(opts);

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

// Route login
exports.login = (req, res, next) => {
    // cryptedResearchedEmail = cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString();
    User.findOne( { email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé!' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect!' })
                    }
                    const newToken = jsonwebtoken.sign(
                        { userId: user._id },
                        'soPekockoAuthTokenxc',
                        { expiresIn: '24h' }
                    );
                    //req.session.token = newToken; // envoi du token en session = création du cookie
                    res.status(200).json({
                        userId: user._id,
                        token: newToken  // le front attend aussi un token en json, donc obligé de laisser ça
                    })
                })
        })
        .catch(error => res.status(500).json({ error }));
};
