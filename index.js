import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import books from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

let cart = {};

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { books, cart });
});

app.post('/add-to-cart/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.ID === bookId);

  if (book) {
    cart[book.Name] = (cart[book.Name] || 0) + 1;
  }
  res.redirect('/');
});

app.get('/cart', (req, res) => {
  res.json(cart);
});

app.get('/weather', (req, res) => {
  res.render('weather', { ip: null, weather: null, error: null });
});

app.post('/weather', async (req, res) => {
  const ip = req.body.ip;
  const address = `http://${ip}/api/weather`;
  try {
    const response = await axios.get(address);
    res.render('weather', { ip, weather: response.data, error: null });
  } catch (ex) {
    res.render('weather', { ip, weather: null, error: `Error getting weather data: ${ex.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
