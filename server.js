const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

//creating one end point sending data to browser
app.get('/', (req, res) => res.send('API working'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//look for env variable called PORT, when deploying that's where it's going to get the port num, defaults to 500 if no env variable is set
const PORT = process.env.PORT || 5000

//callback if we want something to happen when it connects
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



