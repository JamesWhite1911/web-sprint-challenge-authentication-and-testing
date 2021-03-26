//requirements
const router = require('express').Router();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secrets')

const Users = require('../users/users-model')
const { usernameUnique } = require('../middleware/auth-middleware')

//endpoints
// /api/auth/register
router.post('/register', usernameUnique, (req, res, next) => {
  const user = req.body

  //has username and pass
  if (isValid(user)) {
    //hash the password
    user.password = bcrypt.hashSync(user.password, process.env.BCRYPT_ROUNDS || 8) //2^8

    //add the user to the db
    Users.add(user)
      .then(user => {
        //respond with user from our db
        res.status(201).json(user)
      })
      .catch(next)
  } else {
    res.status(400).json({ message: "username and password required" })
  }
});

// /api/auth/login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body

  if (isValid(req.body)) {
    Users.getByFilter({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = buildToken(user)
          res.json({
            message: `welcome, ${username}`,
            token
          })
        } else {
          res.status(401).json('invalid credentials')
        }
      })
      .catch(next)
  } else {
    res.status(401).json('username and password required')
  }
});

//helper functions
function isValid(user) {
  return Boolean(user.username && user.password && typeof user.password === "string");
}

function buildToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    password: user.password
  }
  const config = {
    expiresIn: '1d',
  }
  return jwt.sign(
    payload, jwtSecret, config
  )
}

module.exports = router;
