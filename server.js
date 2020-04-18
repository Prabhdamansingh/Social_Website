const express = require('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path');

// connect db
connectDB();

// sending data to browser
// this is end point

//init middelware // body parser middleware
app.use(express.json({ extended: false }));

// Define routes for middleware
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

// serve static action in production
if (process.env.NODE_ENV === 'production') {
    // static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000; //

app.listen(PORT, () => console.log(`server started on ${PORT}`));
