const db = require('../database/dbConfig.js');

module.exports = {
  add,
  get,
  find,
  findBy,
  findById,
};

function get() {
  return db('users').select('id', 'username');
}

function find() {
  return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
  return db('users').where(filter);
}

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);  
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}
