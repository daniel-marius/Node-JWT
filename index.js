const PORT = process.env.PORT || 4000;

const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

const routes = require("./routes/routes");
const dbConnection = require("./config/dbConn");

dotenv.config({ path: "./config/config.env" });

dbConnection();

const LIMIT = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests' // message to send
});

// Options for cors midddleware
const OPTIONS = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: `http://localhost:${PORT}`,
  preflightContinue: false,
};

const app = express();

// Middlewares
// Helmet can help protect your app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
app.use(helmet());
// Enables CORS with various options
app.use(cors(OPTIONS));
// This is a way to deal with DOS attacks, by adding a limit to the body payload
app.use(bodyParser.json({ limit: '1024kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
// Data sanitization against XSS
app.use(xss());
// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

// Routes
// Setting limiter on specific route could limit the number of DOS attacks
app.use("/api/user", routes, LIMIT);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
