const allowedOrigins = [
  'https://phoenix-frontend-seven.vercel.app',
  'http://localhost:3000'  // <-- Make sure this is present and correct
];

// Comprehensive CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Explicitly handle preflight requests for all routes
app.options('*', cors());