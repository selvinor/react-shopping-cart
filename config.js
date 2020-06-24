require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  // MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_URL: process.env.TESTDB_URL,
  MONGODB_URI: process.env.TESTDB_URL,
  TEST_DATABASE_URL: process.env.TESTDB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '1d'
};
