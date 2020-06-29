const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.connect(MONGODB_URI, { useFindAndModify: false })
  .then(() => {
    console.log('Dropping database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
