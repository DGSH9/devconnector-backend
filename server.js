const express = require('express');
const connectDB = require('./config/db');

const app = express();

//database connect
connectDB();

//init middleare
app.use(express.json({ extended: false }));

app.get('/', (req, res, next) => res.send('API Running'));

app.use('/api/users', require('./routes/users.js'));
app.use('/api', require('./routes/posts.js'));
app.use('/api', require('./routes/profile.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));