//requirements
const db = require('../../data/dbConfig')


//queries
//add a user
const add = async (user) => {
    const [id] = await db('users').insert(user)

    return getById(id)
}

//get a user by id
const getById = (id) => {
    return db('users').where({ id }).first();
}

//get a user by filter
const getByFilter = (filter => {
    return db('users').where(filter)
})

module.exports = {
    add,
    getById,
    getByFilter
}