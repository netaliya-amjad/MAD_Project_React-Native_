require('dotenv').config(); // Import dotenv to load variables from .env file
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Serve static assets (images) from the 'public/assets' folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST, // This will get DB_HOST from the .env file
  user: process.env.DB_USER, // This will get DB_USER from the .env file
  password: process.env.DB_PASSWORD, // This will get DB_PASSWORD from the .env file
  database: process.env.DB_NAME, // This will get DB_NAME from the .env file
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// Signup Route
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username.trim(), email.trim(), password.trim()], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Signup failed', error: err.message });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token will expire in 1 hour
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token, // Return the generated token
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email.trim(), password.trim()], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Login failed', error: err.message });
    }
    if (results.length > 0) {
      // Generate JWT token
      const token = jwt.sign({ userId: results[0].id, email: results[0].email }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token will expire in 1 hour
      });

      return res.status(200).json({
        message: 'Login successful',
        token, // Return the generated token
        user: results[0],
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Add user information to request object
    next();
  });
};

// Update Profile Route (protected by JWT token)
app.put('/users/:id', verifyToken, (req, res) => {
  if (req.user.userId !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const { username, email } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  db.query(sql, [username.trim(), email.trim(), req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Update failed', error: err.message });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});

app.delete('/delete-profile', verifyToken, (req, res) => {
  const userId = req.user.userId; // Ensure you're getting the userId from decoded JWT
  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Failed to delete profile' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  });
});

// Nail Art Designs - CRUD Routes

// Create new nail art design
app.post('/nailart', (req, res) => {
  const { title, image_url, description, price } = req.body;
  const sql = 'INSERT INTO nailart_designs (name, imageUrl, description, price) VALUES (?, ?, ?, ?)';
  db.query(sql, [title.trim(), image_url.trim(), description.trim(), price], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to add design', error: err.message });
    }
    res.status(201).json({ message: 'Design added successfully', id: result.insertId });
  });
});

// Get all nail art designs
app.get('/nailart', (req, res) => {
  const sql = 'SELECT * FROM nailart_designs';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch designs', error: err.message });
    }

    res.status(200).json(results);
  });
});



// Bookings Routes

// Create booking
app.post('/bookings', (req, res) => {
  const { user_id, nailart_id, booking_date, time_slot, artist_name } = req.body;

  const sql = `
    INSERT INTO bookings 
    (user_id, nailart_id, booking_date, time_slot, artist_name, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [user_id, nailart_id, booking_date, time_slot, artist_name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Booking failed', error: err.message });
    }

    res.status(201).json({
      message: 'Booking confirmed',
      booking_id: result.insertId,
      user_id,
      nailart_id,
      booking_date,
      time_slot,
      artist_name
    });
  });
});

// Get all bookings for a specific user
app.get('/user-bookings/:user_id', (req, res) => {
  const userId = req.params.user_id;
  console.log(userId);
  const sql = `
    SELECT 
      b.id AS booking_id,
      b.booking_date,
      b.time_slot,
      b.artist_name,
      n.name AS design_name,
      n.price AS design_price,
      n.imageUrl AS design_image
    FROM bookings b
    JOIN nailart_designs n ON b.nailart_id = n.id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
    }

    res.status(200).json(results);
  });
});

const moment = require('moment'); // install if needed: npm install moment

app.put('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const { artist_name, booking_date, time_slot } = req.body;

  const getBookingQuery = 'SELECT * FROM bookings WHERE id = ?';
  db.query(getBookingQuery, [bookingId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = results[0];
    const createdTime = moment(booking.created_at);
    const now = moment();
    const diffMinutes = now.diff(createdTime, 'minutes');

    if (diffMinutes > 5) {
      return res.status(403).json({ message: 'Time up! You can no longer edit this booking.' });
    }

    const updateQuery = `
      UPDATE bookings 
      SET artist_name = ?, booking_date = ?, time_slot = ? 
      WHERE id = ?`;
    db.query(updateQuery, [artist_name, booking_date, time_slot, bookingId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating booking' });
      res.json({ message: 'Booking updated successfully' });
    });
  });
});


app.delete('/bookings/:id', (req, res) => {
  const bookingId = req.params.id;

  const getBookingQuery = 'SELECT * FROM bookings WHERE id = ?';
  db.query(getBookingQuery, [bookingId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = results[0];
    const createdTime = moment(booking.created_at);
    const now = moment();
    const diffMinutes = now.diff(createdTime, 'minutes');

    if (diffMinutes > 5) {
      return res.status(403).json({ message: 'Time up! You can no longer cancel this booking.' });
    }

    const deleteQuery = 'DELETE FROM bookings WHERE id = ?';
    db.query(deleteQuery, [bookingId], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting booking' });
      return res.json({ message: 'Booking deleted successfully' });
    });
  });
});


// 1. Create new nailpaint
app.post('/nailpaints', (req, res) => {
  const { name, description, price, image_url, rating, reviews_count, stock } = req.body;

  const sql = 'INSERT INTO nail_paints (name, description, price, image_url, rating, reviews_count, stock) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [name.trim(), description.trim(), price, image_url.trim(), rating, reviews_count, stock], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Database insert error', error: err.message });
    }
    res.status(201).json({ message: 'Nailpaint added successfully', id: result.insertId });
  });
});

// 2. Read all nailpaints
app.get('/nailpaints', (req, res) => {
  db.query('SELECT * FROM nail_paints', (err, results) => {
    if (err) {
      console.error('Select error:', err);
      return res.status(500).json({ error: 'Database fetch error' });
    }
    res.status(200).json(results);
  });
});

// 3. Read single nailpaint by id
app.get('/nailpaints/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM nail_paints WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Select by id error:', err);
      return res.status(500).json({ error: 'Database fetch error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Nailpaint not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Create new order
app.post('/orders', (req, res) => {
  const { user_id, product_id, product_name, product_price } = req.body;
  // console.log(req.body)
  const sql = 'INSERT INTO orders (user_id, product_id, product_name, product_price, order_date) VALUES (?, ?, ?, ?, NOW())';
  db.query(sql, [user_id, product_id, product_name, product_price], (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
    return res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
  });
});

// Get order history for a specific user
app.get('/orders/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching order history:', err);
      return res.status(500).json({ message: 'Failed to fetch order history', error: err.message });
    }
    return res.status(200).json(results);
  });
});

// Helper function to check if within 2 minutes
function isWithinTwoMinutes(createdAt) {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  return (now - createdTime) <= 2 * 60 * 1000; // 2 mins in milliseconds
}

// Backend (server.js) - Modify the DELETE order route
app.delete('/orders/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT order_date FROM orders WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Order not found' });

    const orderDate = result[0].order_date;
    const now = moment();
    const orderMoment = moment(orderDate);

    if (now.diff(orderMoment, 'minutes') >= 2) {
      return res.status(403).json({ message: "Time's up! You can't delete this order now." });
    }

    db.query('DELETE FROM orders WHERE id = ?', [id], (err, deleteResult) => {
      if (err) return res.status(500).json({ error: 'Database delete error' });
      res.status(200).json({ message: 'Order deleted successfully' });
    });
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
