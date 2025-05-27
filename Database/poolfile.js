const mysql = require('mysql2/promise');
require('dotenv').config();



const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  const pool = mysql.createPool(dbConfig);
  
 ///////////////////////////////////new tables
 (async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log("Creating tables in database:", process.env.DB_NAME);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('author', 'admin') DEFAULT 'author',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS news_emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        category_id INT,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        article_id INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name  TEXT NOT NULL,
        email  TEXT NOT NULL,
        message  VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully!");
    connection.release();
  } catch (error) {
    console.error("Database initialization error:", error);
  }
})();


  module.exports = pool;