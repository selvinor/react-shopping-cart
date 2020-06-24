const createKnex = require('knex');

const {MONGODB_URL} = require('./config');

let knex = null;

function dbConnect(url = MONGODB_URL) {
  knex = createKnex({
    client: 'pg',
    connection: url
  });
}

function dbDisconnect() {
  return knex.destroy();
}

function dbGet() {
  return knex;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};
