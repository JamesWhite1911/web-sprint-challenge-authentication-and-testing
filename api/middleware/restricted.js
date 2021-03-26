//requirements
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secrets')


//token validation
module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    //missing token in auth header:
    res.status(401).json({ message: 'token required' })
  } else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        //invalid or expired token in auth header:
        res.status(401).json({ message: 'token invalid' })
      } else {
        //valid token in auth header:
        req.decodedJwt = decoded
        next()
      }
    })
  }
}
