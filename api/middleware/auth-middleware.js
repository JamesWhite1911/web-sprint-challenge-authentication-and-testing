const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/secrets');

const Users = require('../users/users-model')

const usernameUnique = async (req, res, next) => {
    const { username } = req.body

    await Users.getByFilter({ username: username })
        .then(user => {
            if (!user.length) {
                next()
            } else {
                res.status(401).json('username taken')
            }
        })
        .catch(next)
}

const validateCredentials = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
    } else {
        next();
    }
}

module.exports = {
    usernameUnique,
    validateCredentials
}