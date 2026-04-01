import app from './app.js';
import { config } from './config/env.js';

app.get('/', (req, res) => {
  res.send('Welcome to the Finance Management API');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});