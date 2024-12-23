// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (CSS) from the 'public' folder
app.use('/styles', express.static(path.join(__dirname, 'public')));

// Route to render the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
