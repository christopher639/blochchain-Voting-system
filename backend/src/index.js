require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// connect to DB
connectDB();

// routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/info', (req, res) => res.json({ app: 'backend', database: process.env.databaseName || null }));

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');
const statsRoutes = require('./routes/stats');
const positionRoutes = require('./routes/positions');
const voterRoutes = require('./routes/voters');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/voters', voterRoutes);

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
