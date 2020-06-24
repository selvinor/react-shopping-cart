const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Order = require('../src/models/orders');
const Product = require('../src/models/products');

const seedorders = require('../db/seed/orders');
const seedproducts = require('../db/seed/products');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Order.insertMany(seedorders),
      Order.createIndexes(),

      Product.insertMany(seedproducts),
      Product.createIndexes()

    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
