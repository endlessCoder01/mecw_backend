const path = require('path');
const multer = require('multer');
const pool = require('./poolfile');
const Router = express.Router();
const app = express();

app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage });
  
  
  
  // Routes
  Router.post('/api/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  Router.post('/api/articles', upload.single('image'), async (req, res) => {
    try {
      const { title, content, category_id, author_id } = req.body;
      const image = req.file ? req.file.filename : null;
  
      const [result] = await pool.query(
        `INSERT INTO articles 
        (title, content, image, category_id, author_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [title, content, image, category_id, author_id]
      );
  
      res.status(201).json({ id: result.insertId, image });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  Router.get('/api/articles', async (req, res) => {
    try {
      const [articles] = await pool.query(`
        SELECT articles.*, users.username AS author, categories.name AS category 
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        LEFT JOIN categories ON articles.category_id = categories.id
        ORDER BY created_at DESC
      `);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  Router.get('/api/articles/:id', async (req, res) => {
    try {
      const [article] = await pool.query(`
        SELECT articles.*, users.username AS author, categories.name AS category 
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        LEFT JOIN categories ON articles.category_id = categories.id
        WHERE articles.id = ?
      `, [req.params.id]);
      
      if (article.length === 0) return res.status(404).json({ error: 'Article not found' });
      res.json(article[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  Router.post('/api/categories', async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  Router.get('/api/categories', async (req, res) => {
    try {
      const [categories] = await pool.query('SELECT * FROM categories');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = Router;