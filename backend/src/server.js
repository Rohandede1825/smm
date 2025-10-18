require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { startJobs } = require('./jobs');

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT} || 4000`);
      startJobs();
    });
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });

