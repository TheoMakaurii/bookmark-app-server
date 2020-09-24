require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "database": "bookmarks", 
  "connectionString": (process.env.NODE_ENV === 'test')
  ? process.env.TEST_DB_URL
  : process.env.DB_URL,
}