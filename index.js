const express = require('express');
const app = express();
const tickets = require('./routes/tickets');
const trips = require('./routes/trips');
const users = require('./routes/users');
const auth = require('./routes/auth');

app.use(express.json());
app.use('/api/tickets', tickets);
app.use('/api/trips', trips);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.listen(3000, () => console.log(`Listening on port 3000...`));