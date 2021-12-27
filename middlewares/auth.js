const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    const decoded = jwt.verify(token, 'soPekockoAuthToken')
    
    const user = await User.findOne({
      _id: decoded.userId,
    })
    if (!user) {
      throw new Error()
    }
   req.userId = user._id 
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' })
  }
}
module.exports = auth;

