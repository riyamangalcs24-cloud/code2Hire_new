const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();
connectDB();

const app = express();

const defaultDevOrigins = [
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://code2hire.netlify.app',
];

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...defaultDevOrigins,
  ...configuredOrigins,
]);

const isLocalDevOrigin = (origin) => {
  try {
    const parsedOrigin = new URL(origin);
    return ['localhost', '127.0.0.1'].includes(parsedOrigin.hostname);
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = origin?.trim();

    if (
      !normalizedOrigin ||
      allowedOrigins.has(normalizedOrigin) ||
      (process.env.NODE_ENV !== 'production' && isLocalDevOrigin(normalizedOrigin))
    ) {
      callback(null, true);
      return;
    }

    console.error(`[CORS] Blocked origin: ${normalizedOrigin}`);
    callback(new Error(`Not allowed by CORS: ${normalizedOrigin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'x-timestamp',
    'X-Timestamp',
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Interview Portal API is running...',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

const authRoutes = require('./routes/authcontroller');
const analyticsRoutes = require('./routes/analytics');
const questionRoutes = require('./routes/questioncontroller');
const domainRoutes = require('./routes/domains');
const roadmapRoutes = require('./routes/roadmap');

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/roadmap', roadmapRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`,
  );
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the existing process or change PORT in Backend/.env before restarting the server.`,
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
