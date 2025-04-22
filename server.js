const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const route = require("./Database/router")
app.use(express.json());

const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));
app.use("/mecw", route);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'news_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// const pool = mysql.createPool(dbConfig);

// //\\\\\\\\\\\\\\\\\\//////////////////////table rangu
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         username VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         role ENUM('author', 'admin') DEFAULT 'author',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL UNIQUE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS articles (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         content TEXT NOT NULL,
//         image VARCHAR(255),
//         category_id INT,
//         author_id INT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (category_id) REFERENCES categories(id),
//         FOREIGN KEY (author_id) REFERENCES users(id)
//       )
//     `);

//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS comments (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         content TEXT NOT NULL,
//         article_id INT,
//         user_id INT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (article_id) REFERENCES articles(id),
//         FOREIGN KEY (user_id) REFERENCES users(id)
//       )
//     `);

//     connection.release();
//   } catch (error) {
//     console.error('Database initialization error:', error);
//   }
// })();


// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const [result] = await pool.query(
//       'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
//       [username, email, password]
//     );
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/articles', upload.single('image'), async (req, res) => {
//   try {
//     const { title, content, category_id, author_id } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const [result] = await pool.query(
//       `INSERT INTO articles 
//       (title, content, image, category_id, author_id) 
//       VALUES (?, ?, ?, ?, ?)`,
//       [title, content, image, category_id, author_id]
//     );

//     res.status(201).json({ id: result.insertId, image });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/articles', async (req, res) => {
//   try {
//     const [articles] = await pool.query(`
//       SELECT articles.*, users.username AS author, categories.name AS category 
//       FROM articles
//       LEFT JOIN users ON articles.author_id = users.id
//       LEFT JOIN categories ON articles.category_id = categories.id
//       ORDER BY created_at DESC
//     `);
//     res.json(articles);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/articles/:id', async (req, res) => {
//   try {
//     const [article] = await pool.query(`
//       SELECT articles.*, users.username AS author, categories.name AS category 
//       FROM articles
//       LEFT JOIN users ON articles.author_id = users.id
//       LEFT JOIN categories ON articles.category_id = categories.id
//       WHERE articles.id = ?
//     `, [req.params.id]);
    
//     if (article.length === 0) return res.status(404).json({ error: 'Article not found' });
//     res.json(article[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/categories', async (req, res) => {
//   try {
//     const { name } = req.body;
//     const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/categories', async (req, res) => {
//   try {
//     const [categories] = await pool.query('SELECT * FROM categories');
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.get("/mecw", (req, res) => {
  res.send("Ministry of Environment, Climate And Weather Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));