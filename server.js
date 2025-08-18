// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'includes')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});